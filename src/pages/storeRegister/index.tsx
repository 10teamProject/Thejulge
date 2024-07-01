import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import Modal from '@/components/auth/ErrorModal';
import Button from '@/components/common/Button';
import Input from '@/components/common/InputComponent';
import DropDown from '@/components/dropDown/DropDown';
import ImageUpload from '@/components/storeRegister/ImageUpload';
import useWindowSize from '@/hooks/useWindowSize';
import { StoreProfileProps } from '@/types/storeProfileTypes';
import { addressOptions, categoryOptions } from '@/utils/Options';
import Messages from '@/utils/validation/Message';

import { GetUserInfo } from '../api/GetUserInfo';
import { registerStore } from '../api/RegisterStore';
import styles from './StoreRegister.module.scss';

const initialFormValues: StoreProfileProps = {
  name: '',
  category: '',
  address1: '',
  address2: '',
  description: '',
  imageUrl: '',
  originalHourlyPay: 0,
};

export default function StoreRegister() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({
    name: '',
    category: '',
    address1: '',
    address2: '',
    originalHourlyPay: '',
  });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { width } = useWindowSize();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleDropDownChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormValues((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 필수 입력 필드 검증
    const errors: Partial<typeof formErrors> = {};
    if (!formValues.name) {
      errors.name = Messages.NAME_REQUIRED;
    }
    if (!formValues.category) {
      errors.category = Messages.CATEGORY_REQUIRED;
    }
    if (!formValues.address1) {
      errors.address1 = Messages.ADDRESS_REQUIRED;
    }
    if (!formValues.address2) {
      errors.address2 = Messages.ADDRESS_DETAIL_REQUIRED;
    }
    if (!formValues.originalHourlyPay) {
      errors.originalHourlyPay = Messages.HOURLY_PAY_REQUIRED;
    } else if (formValues.originalHourlyPay < 1) {
      errors.originalHourlyPay = Messages.INVALID_HOURLY_PAY;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors as typeof formErrors);
      return;
    }

    try {
      await registerStore(formValues);
      setModalMessage('등록이 완료되었습니다.');
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

  const handleModalClose = async () => {
    const userInfo = await GetUserInfo();
    setIsModalOpen(false);
    if (userInfo && userInfo.type === 'employer' && userInfo.shop?.item?.id) {
      router.push(`/mystore/${userInfo.shop.item.id}`);
    }
  };

  const isFilled =
    !formValues.name ||
    !formValues.category ||
    !formValues.address1 ||
    !formValues.originalHourlyPay ||
    !formValues.address2;

  const getWindowSize = () => {
    return width <= 767 ? 'full' : 'large';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>가게 정보</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formInner}>
          <div className={`${styles.inputWrapper} ${styles.storeName}`}>
            <Input
              label="가게 이름"
              name="name"
              type="text"
              placeholder="입력"
              value={formValues.name}
              onChange={handleInputChange}
              required
              error={formErrors.name}
            />
          </div>
          <div className={`${styles.inputWrapper} ${styles.category}`}>
            <label htmlFor="category" className={styles.label}>
              분류
            </label>
            <DropDown
              name="category"
              value={formValues.category}
              options={categoryOptions}
              onChange={handleDropDownChange}
              placeholder="선택"
              required
              error={formErrors.category}
            />
          </div>
          <div className={`${styles.inputWrapper} ${styles.address1}`}>
            <label htmlFor="address1" className={styles.label}>
              주소
            </label>
            <DropDown
              name="address1"
              value={formValues.address1}
              options={addressOptions}
              onChange={handleDropDownChange}
              placeholder="선택"
              required
              error={formErrors.address1}
            />
          </div>
          <div className={`${styles.inputWrapper} ${styles.address2}`}>
            <Input
              label="상세 주소"
              name="address2"
              type="text"
              placeholder="입력"
              value={formValues.address2}
              onChange={handleInputChange}
              required
              error={formErrors.address2}
            />
          </div>
          <div className={`${styles.inputWrapper} ${styles.pay}`}>
            <Input
              label="기본 시급"
              name="originalHourlyPay"
              type="number"
              placeholder="입력"
              value={formValues.originalHourlyPay.toString()}
              onChange={handleInputChange}
              required
              error={formErrors.originalHourlyPay}
            />
          </div>
          <div className={`${styles.inputWrapper} ${styles.storeImage}`}>
            <label className={styles.label}>가게 이미지</label>
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
          <div className={`${styles.inputWrapper} ${styles.storeInfo}`}>
            <Input
              label="가게 설명"
              name="description"
              type="textarea"
              placeholder="입력"
              value={formValues.description}
              onChange={handleInputChange}
              isTextArea={true}
            />
          </div>
        </div>
        <Button
          children="등록하기"
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
  );
}
