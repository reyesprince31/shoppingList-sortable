import { TbCircleX, TbEqual } from "react-icons/tb";

import { ChangeEvent, useState } from "react";
import { IPropsRow } from "../types/type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ShoppingListRow({ row, onUpdateRow, onDeleteRow }: IPropsRow) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    /* This data is needed to handle between different event to trigger onDragStart */
    data: {
      type: "Row",
      row,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-blue-500 min-h-[60px] opacity-50  border-1 rounded-lg p-2 relative row"></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-1 p-2 flex justify-between items-center rounded-lg gap-2 relative row"
      onMouseOver={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}>
      <div className="flex items-center gap-2">
        <TbEqual className="cursor-grab" {...attributes} {...listeners} />
        <div
          className="w-[180px] max-h-[90px] overflow-y-auto"
          onClick={() => setEditMode(true)}>
          {!editMode && (
            <p className="px-2 py-1 whitespace-pre-wrap">
              <span className="">{row.rowName}</span>
            </p>
          )}
          {editMode && (
            <input
              type="text"
              placeholder="Item Name"
              className="px-2 py-1 w-full"
              name="inputRow"
              value={row.rowName}
              onChange={handleChange}
              autoFocus={editMode}
              onBlur={() => setEditMode(false)}
            />
          )}
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

      {mouseIsOver && (
        <button
          className="absolute -top-2 right-2 bg-gray-50 rounded-full"
          onClick={() => onDeleteRow(row.id, row.cat_id)}>
          <TbCircleX className="text-xl text-red-500" />
        </button>
      )}
    </div>
  );
}

export default ShoppingListRow;
