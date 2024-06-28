import { instance } from './AxiosInstance';

export type ApplicantListParams = {
  shop_id: string;
  notice_id: string;
  offset: number;
  limit: number;
};
type Status = 'pending' | 'accepted' | 'rejected' | 'canceled';
type UserType = 'employer' | 'employee';

export interface ResponseWrapper<T> {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: Array<{
    item: T;
    links: [];
  }>;
  links: [];
}

export interface User {
  id: string;
  email: string;
  type: UserType;
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

export interface Notice {
  id: string;
  hourlyPay: number;
  description: string;
  startsAt: string;
  workhour: number;
  closed: boolean;
}

export interface Item {
  id: string;
  status: Status;
  createdAt: string;
  user: {
    item: User;
    href: string;
  };
  shop: {
    item: Shop;
    href: string;
  };
  notice: {
    item: Notice;
    href: string;
  };
}

export type ResponseType = ResponseWrapper<Item>;

export const GetApplicantList = async (
  shop_id: string,
  notice_id: string,
  params: ApplicantListParams,
): Promise<ResponseType> => {
  const { offset, limit } = params;
  const response = await instance.get(
    `/shops/${shop_id}/notices/${notice_id}/applications?offset=${offset}&limit=${limit}`,
  );
  return response.data;
};
