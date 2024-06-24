import { ChangeEvent, FormEvent, useState } from 'react';

import Input from '@/components/common/InputComponent';
import DropDown, {
  addressOptions,
  categoryOptions,
} from '@/components/dropDown/DropDown';
import styles from './StoreRegister.module.scss';
import ImageUpload from '@/components/storeRegister/ImageUpload';

export default function StoreRegister() {
  const [formValue, setFormValue] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // @TODO: 제출 시 로직 추가
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleChange = (name: string, value: string) => {
    setFormValue({
      ...formValue,
      [name]: value,
    });
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
            value={formValue['name']}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="category" className={styles.dropdownLabel}>
            분류
          </label>
          <DropDown
            name="category"
            value={formValue['category']}
            options={categoryOptions}
            onChange={handleChange}
            placeholder="선택"
          />
        </div>
        <div>
          <label htmlFor="address1" className={styles.dropdownLabel}>
            주소
          </label>
          <DropDown
            name="address1"
            value={formValue['address1']}
            options={addressOptions}
            onChange={handleChange}
            placeholder="선택"
          />
        </div>
        <div>
          <Input
            label="상세 주소"
            name="address2"
            type="text"
            placeholder="입력"
            value={formValue['address2']}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Input
            label="기본 시급"
            name="originalHourlyPay"
            type="number"
            placeholder="입력"
            value={formValue['originalHourlyPay']}
            onChange={handleInputChange}
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
            value={formValue['description']}
            onChange={handleInputChange}
            isTextArea={true}
          />
        </div>
      </form>
    </>
  );
}
