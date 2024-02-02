import { useState } from "react";
import { ICategory } from "../App";
import { TbBasketPlus } from "react-icons/tb";

function ShoppingListForm({ onSave }: { onSave: (data: ICategory) => void }) {
  const [listName, setListName] = useState("");
  const [listType, setListType] = useState("");

  const handleSave = () => {
    if (!listName || !listType) {
      alert("Input Missing fields");
    }

    const savedCat: ICategory = {
      categoryName: listName,
      categoryType: listType,
    };

    onSave(savedCat);
    setListName("");
    setListType("");
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        className="border px-2 border-black h-[40px]"
        placeholder="Shopping list name..."
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <select
        value={listType}
        onChange={(e) => setListType(e.target.value)}
        className="border px-2 border-black h-[40px]">
        <option value="">Category Type</option>
        <option value="Grocery">Grocery</option>
        <option value="Home Goods">Home Goods</option>
        <option value="Hardware">Hardware</option>
      </select>
      <button
        className="bg-blue-500 text-white h-[40px] px-4 py-2 w-[150px] rounded-full flex items-center justify-center gap-2 text-lg"
        onClick={handleSave}>
        <TbBasketPlus />
        Save
      </button>
    </div>
  );
}

export default ShoppingListForm;
