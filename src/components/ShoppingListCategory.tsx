import { TbEqual, TbPlaylistAdd, TbTrashX } from "react-icons/tb";

import ShoppingListRow from "./ShoppingListRow";
import { useState } from "react";
import { ICategory, IShopRow } from "../types/type";

interface Props {
  cat: ICategory;
  onUpdateCategoryName: (id: number, categoryName: string) => void;
  onCreateRow: (cat_id: number) => void;
  onDeleteRow: (id: number, cat_id: number) => void;
  onUpdateRow: (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => void;
  shoppingRow: IShopRow[];
  onDeleteCategory: (id: number) => void;
}

function ShoppingListCategory({
  cat,
  onUpdateCategoryName,
  onCreateRow,
  onDeleteRow,
  onUpdateRow,
  shoppingRow,
  onDeleteCategory,
}: Props) {
  const { id, categoryType, categoryName } = cat;
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <span className="text-xs text-gray-300">{categoryType}</span>
      <div className="p-2 bg-[#F5F6F8] min-h-[500px] w-[350px] space-y-2">
        <div className="flex flex-col h-[500px] rounded-lg gap-2 ">
          <div className="flex gap-2 items-center px-1 py-2">
            <TbEqual className="text-xl cursor-grab" />
            <div className="flex-grow gap-2 items-center">
              {editMode ? (
                <input
                  type="text"
                  value={categoryName}
                  autoFocus={editMode}
                  className="w-full px-2 text-xl font-semibold"
                  onBlur={() => setEditMode(false)}
                  onChange={(e) => {
                    onUpdateCategoryName(id!, e.target.value);
                  }}
                />
              ) : (
                <h2
                  className="text-xl px-2 font-semibold"
                  onClick={() => setEditMode(true)}>
                  {categoryName}
                </h2>
              )}
            </div>

            <button onClick={() => onDeleteCategory(id!)} className="px-2">
              <TbTrashX className="text-rose-500 text-lg" />
            </button>
          </div>
          <div className="flex flex-col gap-2 flex-grow bg-white rounded-lg p-2 overflow-x-auto">
            {shoppingRow.map((row) => (
              <ShoppingListRow
                key={row.id}
                row={row}
                onDelete={onDeleteRow}
                onUpdateRow={onUpdateRow}
              />
            ))}
          </div>
        </div>
        <button
          className="bg-[#0076FF] h-[40px] w-full font-semibold text-white rounded-full flex items-center justify-center gap-2"
          onClick={() => onCreateRow(id!)}>
          <TbPlaylistAdd className="text-2xl" /> Add Row
        </button>
      </div>
    </div>
  );
}

export default ShoppingListCategory;
