import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';

import Modal from '@/components/auth/ErrorModal';
import Button from '@/components/common/Button';
import Input from '@/components/common/InputComponent';
import DropDown from '@/components/dropDown/DropDown';
import ImageUpload from '@/components/storeRegister/ImageUpload';
import useWindowSize from '@/hooks/useWindowSize';
import cameraImg from '@/public/assets/icon/icon_camera_white.svg';
import closeImg from '@/public/assets/images/black_x.png';
import { StoreProfileProps } from '@/types/storeProfileTypes';
import { categoryOptions } from '@/utils/Options';
import Messages from '@/utils/validation/Message';

import { GetMyStore } from '../api/getMystore';
import { GetUserInfo } from '../api/GetUserInfo';
import { registerStore } from '../api/RegisterStore';
import { updateStore } from '../api/UpdateStore';
import styles from './StoreRegister.module.scss';
import DaumAddressInput from '@/components/storeRegister/DaumAddressInput';
import { getNumberOnly } from '@/utils/GetNumberOnly';
import {
  initialFormErrors,
  initialFormValues,
  validateForm,
} from '@/utils/storeRegister/formUtils';

interface StoreRegisterProps {
  shop_id: string;
  formData: StoreProfileProps | null;
  isEditing: boolean;
  error?: string;
}

export default function StoreRegister({
  shop_id,
  formData,
  isEditing,
}: StoreRegisterProps) {
  const [formValues, setFormValues] = useState(formData || initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState('');
  const { width } = useWindowSize();

  // 입력값 변경 핸들러
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errors = validateForm({ ...formValues, [name]: value });
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name as keyof typeof errors] || '',
    }));
  };

  // 주소 변경 핸들러
  const handleAddressChange = (value: string) => {
    const updatedValues = { ...formValues, address1: value };
    setFormValues(updatedValues);

    const errors = validateForm(updatedValues);
    setFormErrors((prev) => ({
      ...prev,
      address1: errors.address1 || '',
    }));
  };

  const handleDetailAddressChange = (value: string) => {
    const updatedValues = { ...formValues, address2: value };
    setFormValues(updatedValues);

    const errors = validateForm(updatedValues);
    setFormErrors((prev) => ({
      ...prev,
      address2: errors.address2 || '',
    }));
  };

  // 드롭다운 변경 핸들러
  const handleDropDownChange = (name: string, value: string) => {
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    const errors = validateForm(updatedValues);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name as keyof typeof errors] || '',
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (url: string) => {
    const updatedValues = { ...formValues, imageUrl: url };
    setFormValues(updatedValues);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors as typeof formErrors);
      return;
    }

    try {
      if (isEditing) {
        await updateStore(shop_id, formValues);
        setModalMessage('수정이 완료되었습니다.');
      } else {
        await registerStore(formValues);
        setModalMessage('등록이 완료되었습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === Messages.NETWORK_ERROR) {
          setModalMessage(Messages.REGISTER_FAILED);
        } else {
          setModalMessage(error.message);
        }
      }
    } finally {
      setIsModalOpen(true);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = async () => {
    const userInfo = await GetUserInfo();
    setIsModalOpen(false);
    if (userInfo && userInfo.type === 'employer' && userInfo.shop?.item?.id) {
      router.push(`/mystore/${userInfo.shop.item.id}`);
    }
  };

  // 폼 입력 완료 여부 확인
  const isFilled =
    !formValues.name ||
    !formValues.category ||
    !formValues.address1 ||
    !formValues.address2 ||
    !formValues.originalHourlyPay ||
    !formValues.imageUrl;

  // 화면 크기 확인
  const getWindowSize = () => {
    return width <= 767 ? 'full' : 'large';
  };

  // 이미지 URL 가져오기
  const imageUrl = formValues.imageUrl || initialFormValues.imageUrl;

  // 이전 페이지로 돌아가기
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>가게 정보</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formInner}>
            <div className={`${styles.inputWrapper} ${styles.storeName}`}>
              <Input
                label="가게 이름"
                name="name"
                type="text"
                placeholder="상호명을 입력해 주세요."
                value={formValues.name}
                onChange={handleInputChange}
                required
                error={formErrors.name}
              />
            </div>
            <div className={`${styles.inputWrapper} ${styles.category}`}>
              <label htmlFor="category" className={styles.label}>
                분류*
              </label>
              <DropDown
                name="category"
                value={formValues.category}
                options={categoryOptions}
                onChange={handleDropDownChange}
                placeholder="선택"
                error={formErrors.category}
              />
            </div>
            <div className={`${styles.inputWrapper} ${styles.address}`}>
              <DaumAddressInput
                onChangeAddress={handleAddressChange}
                onChangeDetailAddress={handleDetailAddressChange}
                initialValueAddress={formData?.address1 || ''}
                initialValueDetailAddress={formData?.address2 || ''}
                errorAddress={formErrors.address1}
                errorDetailAddress={formErrors.address2}
              />
            </div>
            <div className={`${styles.inputWrapper} ${styles.pay}`}>
              <Input
                label="기본 시급"
                name="originalHourlyPay"
                type="number"
                placeholder="기본 시급을 입력해 주세요"
                value={formValues.originalHourlyPay.toString()}
                onChange={handleInputChange}
                onKeyDown={getNumberOnly}
                required
                error={formErrors.originalHourlyPay}
              />
              <span className={styles.won}>원</span>
            </div>
            <div className={`${styles.inputWrapper} ${styles.storeImage}`}>
              <label className={styles.label}>가게 이미지*</label>
              <div className={styles.imageWrapper}>
                {isEditing && (
                  <div className={styles.imageEditCover}>
                    <Image src={cameraImg} alt="카메라 이미지" />
                    이미지 변경하기
                  </div>
                )}
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  initialImageUrl={imageUrl}
                />
              </div>
            </div>
            <div className={`${styles.inputWrapper} ${styles.storeInfo}`}>
              <Input
                label="가게 설명"
                name="description"
                type="textarea"
                placeholder="가게 설명을 입력해 주세요"
                value={formValues.description}
                onChange={handleInputChange}
                isTextArea={true}
              />
            </div>
          </div>
          <Button
            children={!isEditing ? '등록하기' : '완료하기'}
            disabled={isFilled}
            size={getWindowSize()}
          />
        </form>
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          message={modalMessage}
        />
      </div>
      <button onClick={handleGoBack}>
        <Image src={closeImg} alt="X" className={styles.closeImg} />
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shop_id } = context.query;

  if (typeof shop_id !== 'string') {
    return {
      props: { shop_id: '', formData: null, isEditing: false },
    };
  }

  const storeData = await GetMyStore(shop_id);

  return {
    props: { shop_id, formData: storeData, isEditing: true },
  };
};
