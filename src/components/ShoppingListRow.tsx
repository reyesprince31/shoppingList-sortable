import { TbCircleX, TbEqual } from "react-icons/tb";

import { ChangeEvent, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IPropsRow } from "../utils/types/type";

function ShoppingListRow({ row, onUpdateRow, onDeleteRow }: IPropsRow) {
  const [mouseIsOver, setMouseIsOver] = useState(false); // State for tracking mouse hover
  const [editMode, setEditMode] = useState(false); // State for managing edit mode

  // Set up drag-and-drop functionality
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,

    data: {
      type: "Row",
      row,
    }, // Data used for handling different drag events
  });

  // Apply transform and transition styles
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Update row data based on change
    const { value, name } = e.target;

    if (name === "inputRow") {
      onUpdateRow(row.id, row.cat_id, value, name);
    }
    if (name === "options") {
      onUpdateRow(row.id, row.cat_id, value, name);
    }
  };

  // Conditional rendering based on dragging state
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-blue-500 min-h-[60px] opacity-50  border-1 rounded-lg p-2 relative row"></div>
    );
  }
  // Visual representation of the row while dragging

  // Normal rendering of the row
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-1 p-2 flex justify-between items-center rounded-lg gap-2 relative row"
      onMouseOver={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}>
      <div className="flex items-center gap-2">
        {/* Drag handle icon */}
        <TbEqual
          className="cursor-grab min-w-[30px] text-xl text-gray-500"
          {...attributes}
          {...listeners}
        />
        <div
          className="max-w-[200px] max-h-[90px] overflow-y-auto overflow-x-hidden"
          onClick={() => setEditMode(true)} // Toggle edit mode on click
        >
          {!editMode && (
            <p
              className="px-2 py-1 whitespace-pre-wrap text-gray-400 min-w-[160px]" // Display row name in view mode
            >
              <span className="">{row.rowName}</span>
            </p>
          )}
          {editMode && (
            <textarea // textarea input field for editing row name
              placeholder="Item Name"
              className="px-2 py-1 resize-none"
              name="inputRow"
              value={row.rowName}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false); // Exit edit mode on Enter key press
              }}
              onBlur={() => setEditMode(false)}
              autoFocus
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          name="options"
          className=" bg-transparent"
          value={row.quantity}
          onChange={handleChange}>
          {/*Quantity dropdown*/}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Show delete button when hovering over the row */}
      {mouseIsOver && (
        <button
          className="absolute -top-2 right-2 bg-gray-50 rounded-full"
          onClick={() => onDeleteRow(row.id, row.cat_id)} // Trigger delete function
        >
          <TbCircleX className="text-xl text-red-500" />
        </button>
      )}
    </div>
  );
}

export default ShoppingListRow;
