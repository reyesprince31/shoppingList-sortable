export type ICategory = {
  id: number;
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

export interface IPropsCategory {
  cat: ICategory;
  shoppingRow: IShopRow[];
  onUpdateCategoryName: (id: number, categoryName: string) => void;
  onCreateRow: (cat_id: number) => void;
  onDeleteRow: (id: number, cat_id: number) => void;
  onUpdateRow: (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => void;
  onDeleteCategory: (id: number) => void;
}

export interface IPropsRow {
  row: IShopRow;
  onUpdateRow: (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => void;
  onDeleteRow: (id: number, cat_id: number) => void;
}
