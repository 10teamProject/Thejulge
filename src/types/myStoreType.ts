export interface RequestParams {
  offset: number;
  limit: number;
}

export interface Item {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
}

export interface ResponseStructure {
  count: number; // 전체 개수
  hasNext: boolean; // 다음 내용 존재 여부
  items: {
    item: Item;
  }[];
}

// 상세 정보 타입

// Shop 타입 정의
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

// ShopReference 타입 정의
export interface ShopReference {
  item: Shop;
  href: string;
}

// Application 상태를 위한 Union 타입 정의
export type ApplicationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'canceled';

// Application 타입 정의
export interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
}

// ApplicationReference 타입 정의
export interface ApplicationReference {
  item: Application;
}

// Job 타입 정의
export interface Job {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: ShopReference;
  currentUserApplication?: ApplicationReference;
}

// 전체 Response 타입 정의
export interface JobResponse {
  item: Job;
  links: [];
}
