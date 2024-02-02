import { TbEqual, TbTrashX } from "react-icons/tb";

import { ChangeEvent, useState } from "react";
import { IShopRow } from "../types/type";

interface Props {
  row: IShopRow;
  onUpdateRow: (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => void;
  onDelete: (id: number, cat_id: number) => void;
}

function ShoppingListRow({ row, onUpdateRow, onDelete }: Props) {
  const [editMode, setEditMode] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    if (name === "inputRow") {
      onUpdateRow(row.id, row.cat_id, value, name);
    }

    if (name === "options") {
      {
        onUpdateRow(row.id, row.cat_id, value, name);
      }
    }
  };
  if (editMode) {
    return (
      <div className="border border-1 p-2 flex justify-between items-center rounded-lg gap-2">
        <div className="cursor-grab">
          <TbEqual />
        </div>
        <input
          type="text"
          placeholder="Item Name"
          className="px-2 py-1 w-full"
          name="inputRow"
          value={row.rowName}
          onChange={handleChange}
          autoFocus={editMode}
        />
        <div className="flex items-center gap-2">
          <select name="options" value={row.quantity} onChange={handleChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button onClick={() => onDelete(row.id, row.cat_id)}>
            <TbTrashX className="text-xl text-red-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-1 p-2 flex  items-center rounded-lg gap-2">
      <div className="flex items-center gap-2 w-full">
        <div className="cursor-grab">
          <TbEqual />
        </div>
        <div
          className="w-full px-2 py-1
          "
          onClick={() => setEditMode(true)}>
          {row.rowName}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select name="options" value={row.quantity} onChange={handleChange}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ShoppingListRow;
