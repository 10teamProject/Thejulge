import { AxiosError } from 'axios';

import { instance } from './AxiosInstance';

interface UserInfo {
  email: string;
  password: string;
}

export const LoginUser = async (userInfo: UserInfo) => {
  try {
    const response = await instance.post('/token', userInfo);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};
