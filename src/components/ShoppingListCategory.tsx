import { TbEqual, TbPlaylistAdd, TbTrashX } from "react-icons/tb";

import ShoppingListRow from "./ShoppingListRow";
import { useMemo, useState } from "react";
import { IPropsCategory } from "../types/type";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ShoppingListCategory({
  cat,
  shoppingRow,
  onUpdateCategoryName,
  onCreateRow,
  onDeleteRow,
  onUpdateRow,
  onDeleteCategory,
}: IPropsCategory) {
  const { id, categoryType, categoryName } = cat;
  const [editMode, setEditMode] = useState(false);

  const shoppingRowId = useMemo(() => {
    return shoppingRow.map((row) => row.id);
  }, [shoppingRow]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cat.id,
    /* This data is needed to handle between different event to trigger onDragStart */
    data: {
      type: "Category",
      cat,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-2 bg-slate-50 opacity-60 min-h-[500px] w-[300px] space-y-2 rounded-lg border-2 border-blue-500"></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <span className="text-xs text-gray-300">{categoryType}</span>
      <div className="p-2 bg-[#F5F6F8] min-h-[500px] min-w-[300px]  space-y-2 rounded-lg">
        <div className="flex flex-col h-[500px] rounded-lg gap-2 ">
          <div className="flex gap-2 items-center px-1 py-2">
            <TbEqual
              className="text-xl cursor-grab"
              {...attributes}
              {...listeners}
            />
            <div className="flex-grow gap-2 items-center">
              {editMode ? (
                <input
                  type="text"
                  value={categoryName}
                  autoFocus={editMode}
                  className="w-full px-2 text-xl font-semibold"
                  onBlur={() => setEditMode(false)}
                  onChange={(e) => {
                    onUpdateCategoryName(id, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    setEditMode(false);
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

            <button onClick={() => onDeleteCategory(id)} className="px-2">
              <TbTrashX className="text-rose-500 text-lg" />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-grow bg-white rounded-lg p-2 overflow-x-auto">
            <SortableContext items={shoppingRowId}>
              {shoppingRow.map((row) => (
                <ShoppingListRow
                  key={row.id}
                  row={row}
                  onDeleteRow={onDeleteRow}
                  onUpdateRow={onUpdateRow}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        <button
          className="bg-[#0076FF] h-[40px] w-full font-semibold text-white rounded-full flex items-center justify-center gap-2"
          onClick={() => onCreateRow(id)}>
          <TbPlaylistAdd className="text-2xl" /> Add Row
        </button>
      </div>
    </div>
  );
}

export default ShoppingListCategory;
