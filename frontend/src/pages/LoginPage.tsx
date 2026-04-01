import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login, setToken } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

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
    <main className="auth-shell" data-testid="auth-shell">
      <section className="auth-brand">
        <p className="eyebrow">Editorial Warm</p>
        <h1 className="display-title">Design your day with intention.</h1>
        <p className="brand-copy">Capture tasks, prioritize calmly, and move through your work with clarity.</p>
      </section>

      <Card className="auth-card" data-testid="auth-card">
        <h2>Welcome Back</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-username">Username</label>
          <Input id="login-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <label htmlFor="login-password">Password</label>
          <Input id="login-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p role="alert" className="inline-error">{error}</p> : null}
          <Button type="submit" variant="primary">Sign In</Button>
        </form>
        <p className="auth-switch">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </main>
  );
}
