import { FormEvent, useState } from "react";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

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
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="todo-title">Title</label>
        <Input id="todo-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className="field-group">
        <label htmlFor="todo-description">Description</label>
        <Input id="todo-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      <Button type="submit" variant="primary" className="add-todo-btn">Add Todo</Button>
    </form>
  );
}
