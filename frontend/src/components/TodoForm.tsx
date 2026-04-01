import { FormEvent, useState } from "react";

type TodoFormProps = {
  onSubmit: (payload: { title: string; description: string }) => Promise<void>;
};

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todo-title">Title</label>
      <input id="todo-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <label htmlFor="todo-description">Description</label>
      <input id="todo-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
}
