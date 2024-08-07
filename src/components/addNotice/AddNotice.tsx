import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import Modal from '@/components/common/ConfirmModal';
import { AddNotice, EditNotice, WorkShift } from '@/pages/api/AddNotice';
import { GetMyNoticeDetail } from '@/pages/api/GetMyNotice';
import CheckIcon from '@/public/assets/icon/check_Icon.svg';
import AltIcon from '@/public/assets/icon/danger_mark.svg';

import styles from './AddNotice.module.scss';

interface NoticeFormProps {
  shop_id: string;
  notice_id?: string;
  mode: 'add' | 'edit';
}

function NoticeForm({ shop_id, notice_id, mode }: NoticeFormProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WorkShift>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (mode === 'edit' && notice_id) {
      const fetchNoticeData = async () => {
        try {
          const data = await GetMyNoticeDetail(shop_id, notice_id);
          if (data) {
            setValue('hourlyPay', data.item.hourlyPay);
            // Convert UTC to local time
            const localStartsAt = new Date(data.item.startsAt);
            setValue('startsAt', localStartsAt.toISOString().slice(0, 16));
            setValue('workhour', data.item.workhour);
            setValue('description', data.item.description || '');
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch notice data:', error);
          setIsLoading(false);
        }
      };

      fetchNoticeData();
    }
  }, [shop_id, notice_id, mode, setValue]);

  const onSubmit: SubmitHandler<WorkShift> = async (data) => {
    try {
      // Convert local time to UTC
      const localDate = new Date(data.startsAt);
      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000,
      );

      const formattedData = {
        ...data,
        startsAt: utcDate.toISOString(),
      };

      if (mode === 'add') {
        await AddNotice(shop_id, formattedData);
        setModalMessage('공고가 성공적으로 등록되었습니다.');
      } else if (mode === 'edit' && notice_id) {
        await EditNotice(shop_id, notice_id, formattedData);
        setModalMessage('공고가 성공적으로 수정되었습니다.');
      }
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`공고 ${mode === 'add' ? '등록' : '수정'} 실패:`, error);
      setModalMessage(
        `공고 ${mode === 'add' ? '등록' : '수정'}에 실패했습니다. 다시 시도해주세요.`,
      );
      setIsSuccess(false);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      router.push(`/mystore/${shop_id}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {mode === 'add' ? '공고 등록' : '공고 수정'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          {mode === 'add' ? '등록하기' : '수정하기'}
        </Button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        icon={
          <Image
            src={isSuccess ? CheckIcon : AltIcon}
            alt={isSuccess ? '성공' : '실패'}
            width={24}
            height={24}
          />
        }
        message={modalMessage}
        buttons={[
          {
            text: '확인',
            onClick: handleModalClose,
            variant: isSuccess ? 'primary' : 'secondary',
          },
        ]}
      />
    </div>
  );
}

export default NoticeForm;
