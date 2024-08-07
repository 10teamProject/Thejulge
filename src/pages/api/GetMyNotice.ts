import {
  JobResponse,
  RequestParams,
  ResponseStructure,
} from '@/types/myStoreType';

import { instance } from './AxiosInstance';

export const GetMyNotice = async (
  shop_id: string,
  params: RequestParams,
): Promise<ResponseStructure | null> => {
  try {
    const response = await instance.get(`/shops/${shop_id}/notices`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('데이터를 받아오지 못했습니다', error);
    return null;
  }
};

export const GetMyNoticeDetail = async (
  shop_id: string,
  notice_id: string,
): Promise<JobResponse | null> => {
  try {
    const response = await instance.get<JobResponse>(
      `/shops/${shop_id}/notices/${notice_id}`,
    );
    return response.data;
  } catch (error) {
    console.error('데이터를 받아오지 못했습니다', error);
    return null;
  }
};
