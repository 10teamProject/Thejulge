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

interface StoreRegisterProps {
  shop_id: string;
  formData: StoreProfileProps | null;
  isEditing: boolean;
  error?: string;
}

// 초기 폼 값 설정
const initialFormValues: StoreProfileProps = {
  name: '',
  category: '',
  address1: '',
  address2: '',
  description: '',
  imageUrl: '',
  originalHourlyPay: 0,
};

export default function StoreRegister({
  shop_id,
  formData,
  isEditing,
}: StoreRegisterProps) {
  const [formValues, setFormValues] = useState(formData || initialFormValues);
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

  // 입력값 변경 핸들러
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

  // 주소 변경 핸들러
  const handleAddressChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      address1: value,
    }));

    if (!value.startsWith('서울시')) {
      setFormErrors((prev) => ({
        ...prev,
        address1: '현재 서울에 위치한 가게만 등록이 가능합니다.',
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        address1: '',
      }));
    }
  };

  const handleDetailAddressChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      address2: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      address2: '',
    }));
  };

  // 드롭다운 변경 핸들러
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

  // 이미지 업로드 핸들러
  const handleImageUpload = (url: string) => {
    setFormValues((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  // 폼 제출 핸들러
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
                required
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
