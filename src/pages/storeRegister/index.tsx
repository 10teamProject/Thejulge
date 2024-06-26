import React, { ChangeEvent, FormEvent, useState } from 'react';

import Input from '@/components/common/InputComponent';
import DropDown, {
  addressOptions,
  categoryOptions,
} from '@/components/dropDown/DropDown';
import ImageUpload from '@/components/storeRegister/ImageUpload';
import { storeProfileProps } from '@/types/storeProfileTypes';

import { registerStore } from '../api/RegisterStore';
import styles from './StoreRegister.module.scss';

const initialFormValues: storeProfileProps = {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerStore(formValues);
      console.log('가게 정보 등록 성공:', result);
      // @TODO 등록 완료 모달
      alert('가게 정보 등록 성공');
    } catch (error) {
      console.error('가게 정보 등록 실패:', error);
      alert('가게 정보 등록 실패');
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'originalHourlyPay') {
      setFormValues((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDropDownChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className={styles.title}>가게 정보</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            label="가게 이름"
            name="name"
            type="text"
            placeholder="입력"
            value={formValues.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category" className={styles.dropdownLabel}>
            분류
          </label>
          <DropDown
            name="category"
            value={formValues.category}
            options={categoryOptions}
            onChange={handleDropDownChange}
            placeholder="선택"
            required
          />
        </div>
        <div>
          <label htmlFor="address1" className={styles.dropdownLabel}>
            주소
          </label>
          <DropDown
            name="address1"
            value={formValues.address1}
            options={addressOptions}
            onChange={handleDropDownChange}
            placeholder="선택"
          />
        </div>
        <div>
          <Input
            label="상세 주소"
            name="address2"
            type="text"
            placeholder="입력"
            value={formValues.address2}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Input
            label="기본 시급"
            name="originalHourlyPay"
            type="number"
            placeholder="입력"
            value={formValues.originalHourlyPay.toString()}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>가게 이미지</label>
          <ImageUpload />
        </div>
        <div>
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
        <button
          type="submit"
          disabled={
            !formValues.name ||
            !formValues.category ||
            !formValues.address1 ||
            !formValues.address2 ||
            !formValues.originalHourlyPay
          }
        >
          등록하기
        </button>
      </form>
    </>
  );
}
