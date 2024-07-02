export interface AlertItem {
  id: string;
  createdAt: string;
  result: 'accepted' | 'rejected';
  read: boolean;
  application: {
    item: {
      id: string;
      status: 'pending' | 'accepted' | 'rejected';
    };
    href: string;
  };
  shop: {
    item: {
      id: string;
      name: string;
      category: string;
      address1: string;
      address2: string;
      description: string;
      imageUrl: string;
      originalHourlyPay: number;
    };
    href: string;
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
    href: string;
  };
}

export interface AlertResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: { item: AlertItem }[];
}
