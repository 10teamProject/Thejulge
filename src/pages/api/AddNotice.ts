import Cookies from 'js-cookie';

import { instance } from './AxiosInstance';

export interface WorkShift {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}

export const AddNotice = async (shop_id: string, workShift: WorkShift) => {
  const token = Cookies.get('token');
  const response = await instance.post(`/shops/${shop_id}/notices`, workShift, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.item;
};

export const EditNotice = async (
  shop_id: string,
  notice_id: string,
  workShift: WorkShift,
) => {
  const token = Cookies.get('token');
  const response = await instance.put(
    `/shops/${shop_id}/notices/${notice_id}`,
    workShift,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.item;
};
