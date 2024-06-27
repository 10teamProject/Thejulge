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
