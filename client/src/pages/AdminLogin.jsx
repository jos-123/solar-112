
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      if (!result.token) {
        throw new Error("Login failed. No authentication token received.");
      }

      // Save administrator token
      localStorage.setItem("hm_admin_token", result.token);

      // Remove any customer session from this browser
      localStorage.removeItem("hm_customer_token");
      localStorage.removeItem("hm_customer_user");

      // Open admin dashboard
      navigate("/admin", { replace: true });

    } catch (err) {
      setError(err.message || "Invalid admin email or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">

      <form
        className="login-card"
        onSubmit={submit}
      >

        <Link to="/" className="brand">
          ☀ HAIL MARY
        </Link>

        <span className="eyebrow">
          ADMINISTRATOR ACCESS
        </span>

        <h1>Admin Login</h1>

        <p>
          Sign in to manage HAIL MARY products,
          batteries, inverters and solar projects.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label>
          Admin Email

          <input
            type="email"
            placeholder="Enter admin email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Password

          <input
            type="password"
            placeholder="Enter admin password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button
          className="button"
          type="submit"
          disabled={busy}
        >
          {busy ? "Signing in..." : "Login to Admin Panel"}
        </button>

        <Link to="/" className="back-link">
          ← Back to website
        </Link>

      </form>

    </main>
  );
}
