import { TbEqual, TbPlaylistAdd, TbTrashX } from "react-icons/tb";
import { ICategory, IShopRow } from "../App";

import ShoppingListRow from "./ShoppingListRow";

interface Props {
  cat: ICategory;
  handleCreateRow: (cat_id: number) => void;
  handleDeleteRow: (id: number, cat_id: number) => void;
  handleUpdateRow: (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => void;
  shoppingRow: IShopRow[];
  onDelete: (id: number) => void;
}

function ShoppingListCategory({
  cat,
  handleCreateRow,
  handleDeleteRow,
  handleUpdateRow,
  shoppingRow,
  onDelete,
}: Props) {
  const { id, category, name } = cat;

  return (
    <div>
      <span className="text-xs text-gray-300">{category}</span>
      <div className="p-2 bg-[#F5F6F8] min-h-[500px] w-[350px] space-y-2">
        <div className="flex flex-col h-[500px] rounded-lg gap-2 ">
          <div className="flex justify-between px-1 py-2">
            <div className="flex gap-2 items-center">
              <TbEqual className="text-xl cursor-grab" />
              <h2 className="text-xl font-semibold">{name}</h2>
            </div>

            <button onClick={() => onDelete(id!)} className="px-2">
              <TbTrashX className="text-rose-500 text-lg" />
            </button>
          </div>
          <div className="flex flex-col gap-2 flex-grow bg-white rounded-lg p-2 overflow-x-auto">
            {shoppingRow.map((row) => (
              <ShoppingListRow
                key={row.id}
                row={row}
                onDelete={handleDeleteRow}
                handleUpdateRow={handleUpdateRow}
              />
            ))}
          </div>
        </div>
        <button
          className="bg-[#0076FF] h-[40px] w-full font-semibold text-white rounded-full flex items-center justify-center gap-2"
          onClick={() => handleCreateRow(id!)}>
          <TbPlaylistAdd className="text-2xl" /> Add Row
        </button>
      </div>
    </div>
  );
}

export default ShoppingListCategory;
