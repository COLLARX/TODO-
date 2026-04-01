import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/client";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await register({ username, password });
      navigate("/login");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "registration failed");
    }
  };

  return (
    <main className="app-shell">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-username">Username</label>
        <input id="register-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </main>
  );
}
