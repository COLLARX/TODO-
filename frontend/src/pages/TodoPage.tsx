import { useEffect, useMemo, useState } from "react";

import { CreateTodoPayload, TodoItem, createTodo, deleteTodo, listTodos, updateTodo } from "../api/client";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { Card } from "../components/ui/Card";

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

  const summary = useMemo(() => {
    const done = todos.filter((todo) => todo.status === "DONE").length;
    return { total: todos.length, done, pending: todos.length - done };
  }, [todos]);

  return (
    <main className="todo-shell" data-testid="todo-shell">
      <header className="todo-header">
        <div>
          <p className="eyebrow">Daily Planner</p>
          <h1 className="display-title">Your Editorial Task Board</h1>
        </div>
        <div className="summary-row" aria-label="todo summary">
          <span className="summary-pill">Total {summary.total}</span>
          <span className="summary-pill summary-pending">Pending {summary.pending}</span>
          <span className="summary-pill summary-done">Done {summary.done}</span>
        </div>
      </header>

      <Card className="todo-composer" data-testid="todo-composer-card">
        <h2>Add a task</h2>
        <TodoForm onSubmit={handleCreate} />
      </Card>

      {error ? <p role="alert" className="inline-error">{error}</p> : null}

      <Card as="section" className="todo-board">
        <TodoList todos={todos} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      </Card>
    </main>
  );
}
