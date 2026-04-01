import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login, setToken } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await login({ username, password });
      setToken(response.token);
      navigate("/todos");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "login failed");
    }
  };

  return (
    <main className="app-shell">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-username">Username</label>
        <input id="login-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit">Sign In</button>
      </form>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
