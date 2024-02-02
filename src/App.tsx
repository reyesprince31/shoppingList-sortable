import { useMemo, useState } from "react";
import { ICategory, IShopRow } from "./types/type";

import ShoppingListForm from "./components/ShoppingListForm";
import ShoppingListCategory from "./components/ShoppingListCategory";
import { data, rows } from "./data/sampleData";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function App() {
  const [shopCategory, setShopCategory] = useState(data);
  const [shoppingRow, setShoppingRow] = useState(rows);
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);

  const categoryId = useMemo(
    () => shopCategory.map((cat) => cat.id),
    [shopCategory]
  );

  const handleCreateCategory = (data: ICategory) => {
    const newCat = {
      id: shopCategory.length + 1,
      categoryName: data.categoryName,
      categoryType: data.categoryType,
    };

    if (newCat.categoryName && newCat.categoryType) {
      setShopCategory([...shopCategory, newCat]);
      alert("Shopping List Saved!");
    }
  };

  const handleCreateRow = (cat_id: number) => {
    console.log(cat_id);
    const filteredRowByCatId = shoppingRow.filter(
      (rows) => rows.cat_id === cat_id
    );
    const lenght = filteredRowByCatId.length;

    const newRow: IShopRow = {
      //sometimes problem with generating id, will fix soon
      id: lenght + 1,
      cat_id,
      rowName: `New Row ${lenght + 1}`,
      quantity: 1,
    };

    setShoppingRow([...shoppingRow, newRow]);
  };

  const handleUpdateCategoryName = (id: number, categoryName: string) => {
    console.log(id, categoryName);
    const updateName = shopCategory.map((cat) => {
      if (cat.id !== id) return cat;
      return { ...cat, categoryName };
    });
    setShopCategory(updateName);
  };

  const handleUpdateRow = (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => {
    const updateRow = shoppingRow.map((row) => {
      if (row.id !== id || row.cat_id !== cat_id) return row;
      if (eventName === "inputRow") return { ...row, rowName: value as string };
      if (eventName === "options") return { ...row, quantity: value as number };
      return row;
    });

    setShoppingRow(updateRow);
  };

  const handleDeleteCategory = (id: number) => {
    const FilteredCategory = shopCategory.filter((cat) => cat.id !== id);
    setShopCategory(FilteredCategory);
  };

  const handleDeleteRow = (id: number, cat_id: number) => {
    const FilteredRow = shoppingRow.filter(
      (item) => item.id !== id || item.cat_id !== cat_id
    );

    setShoppingRow(FilteredRow);
  };

  const onDragStart = (e: DragStartEvent) => {
    console.log("dragStart: ", e);
    if (e.active.data.current?.type === "Category") {
      setActiveCategory(e.active.data.current.category);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id === over.id) return;

    setShopCategory((category) => {
      const oldIndex = category.findIndex((cat) => cat.id === active.id);
      const newIndex = category.findIndex((cat) => cat.id === over.id);
      return arrayMove(category, oldIndex, newIndex);
    });
  };

  return (
    <div className="min-h-screen flex items-center flex-col gap-10 p-4">
      <h1 className="font-bold text-3xl">Shopping List App</h1>
      <ShoppingListForm onSave={handleCreateCategory} />

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-2 justify-center">
          <SortableContext items={categoryId}>
            {shopCategory.map((cat) => (
              <ShoppingListCategory
                key={cat.id}
                cat={cat}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategoryName={handleUpdateCategoryName}
                onCreateRow={handleCreateRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
                shoppingRow={shoppingRow.filter((row) => row.cat_id === cat.id)}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeCategory && (
              <ShoppingListCategory
                cat={activeCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategoryName={handleUpdateCategoryName}
                onCreateRow={handleCreateRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
                shoppingRow={shoppingRow.filter(
                  (row) => row.cat_id === activeCategory.id
                )}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default App;
