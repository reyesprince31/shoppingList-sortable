import { useState } from "react";

import { TbBasketPlus } from "react-icons/tb";
import { ICategory } from "../types/type";

function ShoppingListForm({ onSave }: { onSave: (data: ICategory) => void }) {
  const [listName, setListName] = useState("");
  const [listType, setListType] = useState("");

  const handleSave = () => {
    if (!listName || !listType) {
      alert("Input Missing fields");
    }

    const savedCat: ICategory = {
      id: 0,
      categoryName: listName,
      categoryType: listType,
    };

    onSave(savedCat);
    setListName("");
    setListType("");
  };

  return (
    <div className="md:flex md:items-center md:w-[500px] md:gap-2 items-center md:space-y-0 space-y-2 ">
      <input
        type="text"
        className="border px-2 border-black h-[40px] w-full"
        placeholder="Shopping list name..."
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <select
        value={listType}
        onChange={(e) => setListType(e.target.value)}
        className="border px-2 border-black h-[40px] w-full">
        <option value="">Category Type</option>
        <option value="Grocery">Grocery</option>
        <option value="Home Goods">Home Goods</option>
        <option value="Hardware">Hardware</option>
      </select>
      <button
        className="bg-blue-500 text-white h-[40px] px-4 py-2  w-full rounded-full flex items-center justify-center gap-2 text-lg"
        onClick={handleSave}>
        <TbBasketPlus />
        Save
      </button>
    </div>
  );
}

export default ShoppingListForm;
