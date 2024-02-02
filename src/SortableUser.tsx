import { useSortable } from "@dnd-kit/sortable";
import { User } from "./Users";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  user: User;
}

function SortableUser(props: Props) {
  const { user } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={user.id}
      className="p-[10px] border border-black text-lg w-[400px]">
      {user.name}
    </div>
  );
}

export default SortableUser;
