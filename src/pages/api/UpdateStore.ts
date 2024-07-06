import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import {
  StoreProfileProps,
  StoreProfileResponse,
} from '@/types/storeProfileTypes';
import Messages from '@/utils/validation/Message';

import { instance } from './AxiosInstance';

export const updateStore = async (
  shop_id: string,
  formData: StoreProfileProps,
) => {
  try {
    const response = await instance.put<StoreProfileResponse>(
      `/shops/${shop_id}`,
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
        if (axiosError.response.status === 401) {
          throw new Error(
            (axiosError.response.data as { message: string })?.message,
          );
        }
        if (axiosError.response.status === 403) {
          throw new Error(
            (axiosError.response.data as { message: string })?.message,
          );
        }
        if (axiosError.response.status === 404) {
          throw new Error(
            (axiosError.response.data as { message: string })?.message,
          );
        }
      }
    }
    throw new Error(Messages.NETWORK_ERROR);
  }
};
