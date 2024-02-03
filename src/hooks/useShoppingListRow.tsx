import { generateId } from "../utils/helper";
import { IShopRow } from "../utils/types/type";
import { useState } from "react";
import { rows } from "../data/sampleData";

export const useShoppingListRows = () => {
  const [shoppingRow, setShoppingRow] = useState<IShopRow[]>(rows);

  // Create a new shopping row
  const createNewRow = (cat_id: number) => {
    const filteredRowByCatId = shoppingRow.filter(
      (rows) => rows.cat_id === cat_id
    );
    const lenght = filteredRowByCatId.length;

    // Generate a new row with a unique ID
    const newRow: IShopRow = {
      id: generateId() + shoppingRow.length,
      cat_id,
      rowName: `New Row ${lenght + 1}`,
      quantity: 1,
    };

    // Add the new row to the existing rows
    setShoppingRow([...shoppingRow, newRow]);
  };

  // Update a shopping row
  const updateRow = (
    id: number,
    cat_id: number,
    value: string | number,
    eventName: string
  ) => {
    const updateRow = shoppingRow.map((row) => {
      if (row.id !== id || row.cat_id !== cat_id) return row;

      // Update rowName if the event is 'inputRow'
      if (eventName === "inputRow") return { ...row, rowName: value as string };

      // Update quantity if the event is 'options'
      if (eventName === "options") return { ...row, quantity: value as number };

      return row;
    });

    // Set the updated rows in the state
    setShoppingRow(updateRow);
  };

  // Delete a shopping row
  const deleteRow = (id: number, cat_id: number) => {
    // Filter out the row to be deleted
    const FilteredRow = shoppingRow.filter(
      (item) => item.id !== id || item.cat_id !== cat_id
    );

    // Set the remaining rows in the state
    setShoppingRow(FilteredRow);
  };

  // Return the shopping rows state and functions for manipulation
  return { shoppingRow, setShoppingRow, createNewRow, updateRow, deleteRow };
};
