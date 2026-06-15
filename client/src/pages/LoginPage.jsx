import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyrightFooter from "../components/CopyrightFooter";
import { loginUser } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

/**
 * Login page — email + password, redirect after success.
 * Why: Brief requires login from profile / header area.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/reservations";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setAuth(data.token, data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <Header />
      <main className="login-page__main">
        <form className="login-page__card" onSubmit={handleSubmit}>
          <h1>Log in</h1>
          <p className="login-page__subtitle">Book stays and view your reservations in Centurion.</p>

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
              autoComplete="current-password"
            />
          </label>

          {error && <p className="login-page__error">{error}</p>}

          <button type="submit" className="login-page__submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="login-page__demo">
            Demo guests: <strong>john@example.com</strong> / password123
            <br />
            Demo host: <strong>jane@example.com</strong> / password321
          </p>

          <Link to="/" className="login-page__back">
            ← Back to home
          </Link>
        </form>
      </main>
      <Footer />
      <CopyrightFooter />
    </div>
  );
}
