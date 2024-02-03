import { TbEqual, TbPlaylistAdd, TbTrashX } from "react-icons/tb";

import ShoppingListRow from "./ShoppingListRow";
import { useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IPropsCategory } from "../utils/types/type";

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

  // Set up drag-and-drop functionality
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cat.id,
    data: {
      type: "Category",
      cat,
    }, // Data used for handling different drag events
  });

  // Apply transform and transition styles
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Conditional rendering based on dragging state
  return isDragging ? (
    <div
      ref={setNodeRef}
      style={style}
      className="p-2 bg-slate-50 opacity-60 min-h-[500px] w-[300px] space-y-2 rounded-lg border-2 border-blue-500"></div>
  ) : (
    <div ref={setNodeRef} style={style}>
      <span className="text-xs text-gray-300">{categoryType}</span>
      <div className="p-2 bg-[#F5F6F8] min-h-[500px] w-[300px] space-y-2 rounded-lg">
        <div className="flex flex-col h-[500px] rounded-lg gap-2 ">
          <div className="flex gap-2 items-center px-1 py-2">
            <TbEqual
              className="text-xl w-[30px] cursor-grab"
              {...attributes}
              {...listeners}
            />
            <div className="flex-grow gap-2 items-center">
              {/* Conditional rendering of category name based on editMode */}
              {editMode ? (
                <input
                  autoFocus
                  type="text"
                  value={categoryName}
                  className="px-2 text-xl font-semibold w-[190px]"
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

            {/* Delete Category */}
            <button onClick={() => onDeleteCategory(id)} className="px-2">
              <TbTrashX className="text-rose-500 text-lg" />
            </button>
          </div>

          {/* Container for displaying shopping categories */}
          <div className="flex flex-col gap-2 flex-grow bg-white rounded-lg p-2 overflow-x-auto">
            {/* SortableContext for ShoppingRow Sorting Operation */}
            <SortableContext items={shoppingRow.map((row) => row.id)}>
              {/* Render each shoppingRow */}
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

        {/* Add Rows */}
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
