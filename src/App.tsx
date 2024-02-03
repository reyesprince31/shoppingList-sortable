import { createPortal } from "react-dom";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { useShoppingListCategories } from "./hooks/useShoppingListCategories";
import { useShoppingListRows } from "./hooks/useShoppingListRow";
import { useDragAndSensors } from "./hooks/useDragAndSensor";

import ShoppingListForm from "./components/ShoppingListForm";
import ShoppingListCategory from "./components/ShoppingListCategory";
import ShoppingListRow from "./components/ShoppingListRow";

function App() {
  //Custom Hook to manage shopping categories state and operations
  const {
    categories,
    setCategories,
    createNewCategory: handleCreateCategory,
    updateCategoryName: handleUpdateCategoryName,
    deleteCategory: handleDeleteCategory,
  } = useShoppingListCategories();

  //Custom Hook to manage shopping rows state and operations
  const { shoppingRow, setShoppingRow, createNewRow, updateRow, deleteRow } =
    useShoppingListRows();

  //Custom Hook to manage drag-and-drop behavior and sensors
  const {
    sensors,
    activeCategory,
    activeRow,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useDragAndSensors({ setCategories, setShoppingRow });

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
          <SortableContext items={categories.map((cat) => cat.id)}>
            {categories.map((cat) => (
              <ShoppingListCategory
                key={cat.id}
                cat={cat}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategoryName={handleUpdateCategoryName}
                /* CRUD props for ShoppingRow */
                onCreateRow={createNewRow}
                onUpdateRow={updateRow}
                onDeleteRow={deleteRow}
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
                onCreateRow={createNewRow}
                onUpdateRow={updateRow}
                onDeleteRow={deleteRow}
                shoppingRow={shoppingRow.filter(
                  (row) => row.cat_id === activeCategory.id
                )}
              />
            )}
            {activeRow && (
              <ShoppingListRow
                row={activeRow}
                onUpdateRow={updateRow}
                onDeleteRow={deleteRow}
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
