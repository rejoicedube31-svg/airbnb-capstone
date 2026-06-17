import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { loginHost } from "../api/client";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("password321");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginHost(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="login-page__main">
        <form className="login-page__card" onSubmit={handleSubmit}>
          <h1>Host login</h1>
          <p className="login-page__subtitle">Sign in to manage your Centurion listings and reservations.</p>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
            />
          </label>

          {error && <p className="login-page__error" role="alert">{error}</p>}

          <button type="submit" className="login-page__submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="login-page__demo">
            Demo host: <strong>jane@example.com</strong> / password321
          </p>

          <Link to="/" className="login-page__back">
            ← Back to dashboard
          </Link>
        </form>
      </main>
    </div>
  );
}
