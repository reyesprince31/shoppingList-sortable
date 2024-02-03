import { useState } from "react";
import { generateId } from "../utils/helper";
import { ICategory } from "../utils/types/type";
import { data } from "../data/sampleData";

export const useShoppingListCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>(data);

  // Create a new shopping category
  const createNewCategory = (data: ICategory) => {
    // Generate a new category with a unique ID
    const newCat = {
      id: generateId() + categories.length,
      categoryName: data.categoryName,
      categoryType: data.categoryType,
    };

    // Add the new category to the existing categories if it has valid name and type
    if (newCat.categoryName && newCat.categoryType) {
      setCategories([...categories, newCat]);

      alert("Shopping List Saved!"); // Display an alert indicating success
    }
  };

  // Update a category's name
  const updateCategoryName = (id: number, categoryName: string) => {
    // Map through categories and update the name of the matching category
    const updateName = categories.map((cat) => {
      if (cat.id !== id) return cat;
      return { ...cat, categoryName };
    });

    // Set the updated categories in the state
    setCategories(updateName);
  };

  // Delete a category and its associated rows
  const deleteCategory = (id: number) => {
    // Filter out the category to be deleted
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== id)
    );
  };

  // Return the shopping categories state and functions for manipulation
  return {
    categories,
    setCategories,
    createNewCategory,
    updateCategoryName,
    deleteCategory,
  };
};
