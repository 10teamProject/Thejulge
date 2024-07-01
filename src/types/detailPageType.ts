export interface Props {
  shopid: string;
  noticeid: string;
}

export interface User {
  id: string;
  email: string;
  type: string;
}

export interface ProfileData {
  name: string;
  phone: string;
  address: string;
  bio: string;
}

export interface Application {
  item: {
    id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    createdAt: string;
    href: string;
    shop: {
      id: string;
      name: string;
      category: string;
      address1: string;
      address2: string;
      description: string;
      imageUrl: string;
      originalHourlyPay: number;
    };
    notice: {
      item: {
        id: string;
        hourlyPay: number;
        description: string;
        startsAt: string;
        workhour: number;
        closed: boolean;
      };
    };
  };
}

export interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface ModalIcon {
  src: string;
  height: number;
  width: number;
  blurWidth?: number;
  blurHeight?: number;
}
