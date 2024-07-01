export interface StoreProfileProps {
  name: string;
  category: string;
  address1: string;
  address2: string;
  originalHourlyPay: number;
  description: string;
  imageUrl: string;
}

export interface StoreProfileResponse {
  item: {
    id: string;
    StoreProfile: StoreProfileProps[];
    user: {
      item: User[];
    };
    href: string;
  };
  links: [];
}

export interface User {
  email: string;
  type: 'employer' | 'employee';
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}
