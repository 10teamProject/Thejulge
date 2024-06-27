import { instance } from './AxiosInstance';

export interface StoreInfo {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

export const GetMyStore = async (shopId: string): Promise<StoreInfo | null> => {
  try {
    const response = await instance.get(`/shops/${shopId}`);

    return response.data.item;
  } catch (error) {
    console.error('데이터를 받아오지 못했습니다', error);
    return null;
  }
};
