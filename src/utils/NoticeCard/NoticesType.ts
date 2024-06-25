export type NoticeResponse = {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: NoticeItem[];
};

export type NoticeItem = {
  item: Notice;
  links: Link[];
};

export type Notice = {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: ShopItem;
};

export type ShopItem = {
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
};

export type Link = {
  rel: string;
  description: string;
  method: string;
  href: string;
};
