import { AxiosError } from 'axios';

import { instance } from './AxiosInstance';

interface UserInfo {
  email: string;
  password: string;
  type: string;
}

export const SignupUser = async (userInfo: UserInfo) => {
  try {
    const response = await instance.post('/users', userInfo);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};
