import { TodoItem } from "../api/client";

type TodoListProps = {
  todos: TodoItem[];
  onToggleStatus: (todo: TodoItem) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function TodoList({ todos, onToggleStatus, onDelete }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <h2>{todo.title}</h2>
          <p>{todo.description}</p>
          <p>{todo.status}</p>
          <button type="button" onClick={() => onToggleStatus(todo)}>
            {todo.status === "DONE" ? "Mark Todo" : "Mark Done"}
          </button>
          <button type="button" onClick={() => onDelete(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
