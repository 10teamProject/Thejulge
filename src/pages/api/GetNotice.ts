import { NoticeResponse } from '@/utils/NoticeCard/NoticesType';

import { instance } from '../api/AxiosInstance';

type NoticeParams = {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
};

export const getNotices = async (params: NoticeParams) => {
  try {
    const response = await instance.get<NoticeResponse>('/notices', { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
