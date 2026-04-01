import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

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
    <main className="auth-shell" data-testid="auth-shell">
      <section className="auth-brand">
        <p className="eyebrow">Create Account</p>
        <h1 className="display-title">Build momentum, one task at a time.</h1>
        <p className="brand-copy">Set up your space and start organizing with a clean and expressive workflow.</p>
      </section>

      <Card className="auth-card" data-testid="auth-card">
        <h2>Get Started</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-username">Username</label>
          <Input id="register-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <label htmlFor="register-password">Password</label>
          <Input id="register-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p role="alert" className="inline-error">{error}</p> : null}
          <Button type="submit" variant="primary">Create Account</Button>
        </form>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
