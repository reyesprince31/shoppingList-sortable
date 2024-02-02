export type ICategory = {
  id?: number;
  categoryName: string;
  categoryType: string;
};

export type IShopRow = {
  id: number;
  cat_id: number;
  rowName: string;
  quantity: number;
};

export type IUpdateRow = {
  id: number;
  cat_id: number;
  value: string | number;
  eventName: string;
};

export type IDs = {
  id: number;
  cat_id: number;
};

export type List = {
  id: number;
  category: ICategory;
};
