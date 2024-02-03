import { useSensor, useSensors } from "@dnd-kit/core";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core/dist/types";
import { PointerSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { ICategory, IShopRow } from "../utils/types/type";

export const useDragAndSensors = ({
  setCategories,
  setShoppingRow,
}: {
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  setShoppingRow: React.Dispatch<React.SetStateAction<IShopRow[]>>;
}) => {
  // State to track the currently active category and row during drag-and-drop
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [activeRow, setActiveRow] = useState<IShopRow | null>(null);

  // Sensors for touch and pointer events
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 30, // Activate dragging after moving 30 pixels
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 30,
      },
    })
  );

  // Event handlers for drag-and-drop interactions
  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Category") {
      setActiveCategory(e.active.data.current.cat);
      return;
    }
    if (e.active.data.current?.type === "Row") {
      setActiveRow(e.active.data.current.row);
      return;
    }
  };

  // Event handler for dragging over a target
  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id === over.id) return;

    const isActiveRow = active.data.current?.type === "Row";
    const isOverRow = over.data.current?.type === "Row";

    if (!isActiveRow) return;

    // Move row within the same category
    if (isActiveRow && isOverRow) {
      setShoppingRow((row) => {
        const activeIndex = row.findIndex((r) => r.id === active.id);
        const overIndex = row.findIndex((r) => r.id === over.id);

        // Change category when dropping a row onto a different one
        row[activeIndex].cat_id = row[overIndex].cat_id;

        // Execute the sort
        return arrayMove(row, activeIndex, overIndex);
      });
    }

    const isOverCategory = over.data.current?.type === "Category";

    // Change category when dropping a row onto a different category
    if (isActiveRow && isOverCategory) {
      setShoppingRow((row) => {
        const activeIndex = row.findIndex((r) => r.id === active.id);

        row[activeIndex].cat_id = over.id as number;

        // Execute the sort
        return arrayMove(row, activeIndex, activeIndex);
      });
    }
  };

  // Event handler for the end of a drag operation
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setActiveCategory(null);
    setActiveRow(null);

    if (!over) return;
    if (active.id === over.id) return;

    // Reorder categories after dragging
    setCategories((category) => {
      const activeIndex = category.findIndex((cat) => cat.id === active.id);
      const overIndex = category.findIndex((cat) => cat.id === over.id);
      return arrayMove(category, activeIndex, overIndex);
    });
  };

  // Return the necessary values and functions for the drag-and-drop functionality
  return {
    sensors,
    activeCategory,
    activeRow,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
};
