import { useEffect, useState } from "react";

import {
  CreateTodoPayload,
  TodoItem,
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "../api/client";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setError("");
      setTodos(await listTodos());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "failed to load todos");
    }
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  const handleCreate = async (payload: CreateTodoPayload) => {
    await createTodo(payload);
    await loadTodos();
  };

  const handleToggleStatus = async (todo: TodoItem) => {
    const updated = await updateTodo(todo.id, {
      title: todo.title,
      description: todo.description ?? "",
      status: todo.status === "DONE" ? "TODO" : "DONE",
    });

    setTodos((currentTodos) => currentTodos.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <main className="app-shell">
      <h1>Todos</h1>
      <TodoForm onSubmit={handleCreate} />
      {error ? <p role="alert">{error}</p> : null}
      <TodoList todos={todos} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
    </main>
  );
}
