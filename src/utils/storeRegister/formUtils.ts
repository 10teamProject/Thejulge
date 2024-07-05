import { StoreProfileProps } from '@/types/storeProfileTypes';
import Messages from '@/utils/validation/Message';

// 초기 폼 값 설정
export const initialFormValues: StoreProfileProps = {
  name: '',
  category: '',
  address1: '',
  address2: '',
  description: '',
  imageUrl: '',
  originalHourlyPay: 0,
};

// 초기 폼 에러 값 설정
export const initialFormErrors = {
  name: '',
  category: '',
  address1: '',
  address2: '',
  originalHourlyPay: '',
};

export const validateForm = (values: StoreProfileProps) => {
  const errors: Partial<typeof initialFormErrors> = {};

  if (!values.name) {
    errors.name = Messages.NAME_REQUIRED;
  }
  if (!values.category) {
    errors.category = Messages.CATEGORY_REQUIRED;
  }
  if (!values.address1) {
    errors.address1 = Messages.ADDRESS_REQUIRED;
  } else if (!values.address1.startsWith('서울시')) {
    errors.address1 = Messages.ADDRESS_SEOUL_ONLY;
  }
  if (!values.address2) {
    errors.address2 = Messages.ADDRESS_DETAIL_REQUIRED;
  }
  if (!values.originalHourlyPay) {
    errors.originalHourlyPay = Messages.HOURLY_PAY_REQUIRED;
  } else if (values.originalHourlyPay < 9620) {
    errors.originalHourlyPay = Messages.INVALID_HOURLY_PAY;
  }
  return errors;
};
