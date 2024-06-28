import qs from 'qs';

import { NoticeResponse } from '@/utils/NoticeCard/NoticesType';

import { instance } from '../api/AxiosInstance';

export type NoticeParams = {
  offset?: number;
  limit?: number;
  address?: string[];
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
};

export const getNotices = async (params: NoticeParams) => {
  try {
    const filteredParams = { ...params };
    if (filteredParams.startsAtGte === '') {
      delete filteredParams.startsAtGte;
    }

    const response = await instance.get<NoticeResponse>('/notices', {
      params: filteredParams,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
