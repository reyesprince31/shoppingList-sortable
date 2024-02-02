import { useState } from "react";
import { data } from "./data";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableUser from "./SortableUser";

export type User = {
  id: string | number;
  name: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>(data);
  const [inputValue, setInputValue] = useState("");

  const addUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: inputValue,
    };
    setInputValue("");
    setUsers((users) => [...users, newUser]);
  };

  const onDragEnd = (event: HTMLElement) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }

    setUsers((users) => {
      const oldIndex = users.findIndex((user) => user.id === active.id);
      const newIndex = users.findIndex((user) => user.id === over.id);
      return arrayMove(users, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div>Total: {users.length}</div>
      <div className="mb-5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-black py-1 px-2"
        />
        <button
          onClick={addUser}
          className="bg-gray-300 w-24 bg px-2 py-1 rounded-md">
          Add user
        </button>
      </div>
      <div>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={users} strategy={verticalListSortingStrategy}>
            {users.map((user) => (
              <SortableUser key={user.id} user={user} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
export default Users;
