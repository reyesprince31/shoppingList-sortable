import { ICategory, IShopRow } from "./types/type";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { data, rows } from "./data/sampleData";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import ShoppingListForm from "./components/ShoppingListForm";
import ShoppingListCategory from "./components/ShoppingListCategory";
import ShoppingListRow from "./components/ShoppingListRow";

function App() {
  const [shopCategory, setShopCategory] = useState(data);
  const [shoppingRow, setShoppingRow] = useState(rows);
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [activeRow, setActiveRow] = useState<IShopRow | null>(null);

  // console.log("shopCat: ", shopCategory);
  // console.log("shopRow: ", shopCategory);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 30,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 30,
      },
    })
  );

  const categoryId = useMemo(
    () => shopCategory.map((cat) => cat.id),
    [shopCategory]
  );

  const handleCreateCategory = (data: ICategory) => {
    const newCat = {
      id: generateId() + shopCategory.length,
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
      id: generateId() + shoppingRow.length,
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

    const FilteredRow = shoppingRow.filter((item) => item.cat_id !== id);
    setShoppingRow(FilteredRow);
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
      setActiveCategory(e.active.data.current.cat);
      return;
    }
    if (e.active.data.current?.type === "Row") {
      setActiveRow(e.active.data.current.row);
      return;
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id === over.id) return;

    const isActiveRow = active.data.current?.type === "Row";
    const isOverRow = over.data.current?.type === "Row";

    if (!isActiveRow) return;

    /* Drop a row over same category */
    if (isActiveRow && isOverRow) {
      setShoppingRow((row) => {
        const activeIndex = row.findIndex((r) => r.id === active.id);
        const overIndex = row.findIndex((r) => r.id === over.id);

        /* Drop a row over different category */
        row[activeIndex].cat_id = row[overIndex].cat_id;

        /* Execute the sort */
        return arrayMove(row, activeIndex, overIndex);
      });
    }

    const isOverCategory = over.data.current?.type === "Category";

    if (isActiveRow && isOverCategory) {
      setShoppingRow((row) => {
        const activeIndex = row.findIndex((r) => r.id === active.id);

        row[activeIndex].cat_id = over.id as number;

        /* Execute the sort */
        return arrayMove(row, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setActiveCategory(null);
    setActiveRow(null);

    if (!over) return;
    if (active.id === over.id) return;

    setShopCategory((category) => {
      const activeIndex = category.findIndex((cat) => cat.id === active.id);
      const overIndex = category.findIndex((cat) => cat.id === over.id);
      return arrayMove(category, activeIndex, overIndex);
    });
  };

  return (
    <div className="min-h-screen flex items-center flex-col gap-10 p-4">
      <h1 className="font-bold text-3xl">Shopping List App</h1>
      <ShoppingListForm onSave={handleCreateCategory} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-2 justify-center">
          <SortableContext items={categoryId}>
            {shopCategory.map((cat) => (
              <ShoppingListCategory
                key={cat.id}
                cat={cat}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategoryName={handleUpdateCategoryName}
                /* CRUD props for ShoppingRow */
                onCreateRow={handleCreateRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
                /* filter the ShoppingRow based on 
                the id of ShoppingListCategory */
                shoppingRow={shoppingRow.filter((row) => row.cat_id === cat.id)}
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          /* To create a snap effect of the drag container 
          to where it supposed to appear */
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
            {activeRow && (
              <ShoppingListRow
                row={activeRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default App;
