import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { StoreProfileProps } from '@/types/storeProfileTypes';
import Messages from '@/utils/validation/Message';

import { instance } from './AxiosInstance';

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
      throw new Error(Messages.REGISTER_FAILED);
    } else {
      console.error(Messages.REGISTER_FAILED, error);
      throw new Error(Messages.NETWORK_ERROR);
    }
  }
};
