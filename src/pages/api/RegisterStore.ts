import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { StoreProfileProps } from '@/types/storeProfileTypes';

import { instance } from './AxiosInstance';

const REGISTER_FAILED = '가게 정보 등록 중 에러가 발생했습니다.';
const NETWORK_ERROR = '네트워크 연결 문제가 발생했습니다.';

export const registerStore = async (formData: StoreProfileProps) => {
  try {
    const response = await instance.post('/shops', formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      console.error('Axios error:', axiosError.message);
      if (axiosError.response) {
        console.error('Status:', axiosError.response.status);
        console.error('Data:', axiosError.response.data);
      }
      throw new Error(REGISTER_FAILED);
    } else {
      console.error(REGISTER_FAILED, error);
      throw new Error(NETWORK_ERROR);
    }
  }
};
