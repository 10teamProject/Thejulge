import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import { AddNotice, WorkShift } from '@/pages/api/AddNotice';

import styles from './AddNotice.module.scss';

interface AddNoticeProps {
  shop_id: string;
}

function AddNoticeComponent({ shop_id }: AddNoticeProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkShift>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<WorkShift> = async (data) => {
    try {
      const formattedData = {
        ...data,
        startsAt: new Date(data.startsAt).toISOString(),
      };

      await AddNotice(shop_id, formattedData);
      alert('공고가 성공적으로 등록되었습니다.');
      router.push(`/mystore/${shop_id}`);
    } catch (error) {
      console.error('공고 등록 실패:', error);
      alert('공고 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>공고 등록</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="hourlyPay">시급*</label>
            <div className={styles.inputWrapper}>
              <input
                id="hourlyPay"
                type="number"
                className={styles.input}
                {...register('hourlyPay', {
                  required: '시급을 입력해주세요.',
                  min: {
                    value: 9620,
                    message: '최저시급(9,620원) 이상의 값을 입력해주세요.',
                  },
                  valueAsNumber: true,
                })}
              />
              <span className={styles.inputSuffix}>원</span>
            </div>
            {errors.hourlyPay && (
              <span className={styles.error}>{errors.hourlyPay.message}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startsAt">시작 일시*</label>
            <input
              id="startsAt"
              type="datetime-local"
              className={styles.input}
              {...register('startsAt', {
                required: '시작 일시를 입력해주세요.',
              })}
            />
            {errors.startsAt && (
              <span className={styles.error}>{errors.startsAt.message}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="workhour">업무 시간*</label>
            <div className={styles.inputWrapper}>
              <input
                id="workhour"
                type="number"
                className={styles.input}
                {...register('workhour', {
                  required: '업무 시간을 입력해주세요.',
                  min: {
                    value: 0.5,
                    message: '최소 0.5시간 이상 입력해주세요.',
                  },
                  valueAsNumber: true,
                })}
                step="0.5"
              />
              <span className={styles.inputSuffix}>시간</span>
            </div>
            {errors.workhour && (
              <span className={styles.error}>{errors.workhour.message}</span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">공고 설명</label>
          <textarea
            id="description"
            className={styles.textarea}
            {...register('description')}
            rows={4}
          />
        </div>

        <Button size="large" position="center">
          등록하기
        </Button>
      </form>
    </div>
  );
}

export default AddNoticeComponent;
