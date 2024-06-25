import { AxiosError, AxiosResponse } from 'axios';

import { instance } from './AxiosInstance';

export interface RootObject {
  item: Item2;
  links: Link[];
}

export interface Link {
  rel: string;
  description: string;
  method: string;
  href: string;
  body?: Body;
  query?: Query;
}

export interface Query {
  offset: string;
  limit: string;
}

export interface Body {
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: string;
}

export interface Item2 {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
  user: User;
}

export interface User {
  item: Item;
  href: string;
}

export interface Item {
  id: string;
  email: string;
  type: string;
}
