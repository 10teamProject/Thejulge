import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { instance } from './AxiosInstance';

// 필요한 타입 정의
export type ApplicationStatus = 'accepted' | 'rejected' | 'canceled';

export interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApiResponse {
  item: Application;
  links: [];
}

const getTokenFromCookie = (): string | undefined => {
  return Cookies.get('token');
};

export const updateApplicationStatus = async (
  shopId: string,
  noticeId: string,
  applicationId: string,
  status: ApplicationStatus,
): Promise<ApiResponse> => {
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  try {
    const response: AxiosResponse<ApiResponse> = await instance.put(
      `/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
};
