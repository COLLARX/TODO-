import { TodoItem } from "../api/client";
import { Button } from "./ui/Button";

type TodoListProps = {
  todos: TodoItem[];
  onToggleStatus: (todo: TodoItem) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function TodoList({ todos, onToggleStatus, onDelete }: TodoListProps) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className="todo-item">
          <div className="todo-item-head">
            <h2>{todo.title}</h2>
            <span className={`status-chip status-${todo.status.toLowerCase()}`}>{todo.status}</span>
          </div>
          {todo.description ? <p className="todo-description">{todo.description}</p> : null}
          <div className="todo-actions">
            <Button type="button" variant={todo.status === "DONE" ? "secondary" : "accent"} onClick={() => onToggleStatus(todo)}>
              {todo.status === "DONE" ? "Mark Todo" : "Mark Done"}
            </Button>
            <Button type="button" variant="danger" onClick={() => onDelete(todo.id)}>
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
