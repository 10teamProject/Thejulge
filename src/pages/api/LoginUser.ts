import { AxiosError, AxiosResponse } from 'axios';

import { instance } from './AxiosInstance';

interface UserInfo {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  type: string;
}

interface LoginResponseData {
  item: {
    token: string;
    user: {
      item: User;
      href: string;
    };
  };
  links: [];
}

export const LoginUser = async (
  userInfo: UserInfo,
): Promise<LoginResponseData> => {
  try {
    const response: AxiosResponse<LoginResponseData> = await instance.post(
      '/token',
      userInfo,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};
