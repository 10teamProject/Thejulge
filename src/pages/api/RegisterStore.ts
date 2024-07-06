import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import {
  StoreProfileProps,
  StoreProfileResponse,
} from '@/types/storeProfileTypes';
import Messages from '@/utils/validation/Message';

import { instance } from './AxiosInstance';

export const registerStore = async (formData: StoreProfileProps) => {
  try {
    const response = await instance.post<StoreProfileResponse>(
      '/shops',
      formData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Axios error:', axiosError.message);
        if (axiosError.response.status === 409) {
          throw new Error(
            (axiosError.response.data as { message: string })?.message,
          );
        }
        if (axiosError.response.status === 400) {
          throw new Error(
            (axiosError.response.data as { message: string })?.message,
          );
        }
      }
      throw new Error(Messages.REGISTER_FAILED);
    }
    console.error(Messages.REGISTER_FAILED, error);
    throw new Error(Messages.NETWORK_ERROR);
  }
};
