import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { site } from "../data/site.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CustomerLogin() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/customer/${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to continue. Please try again.");
      localStorage.setItem("hm_customer_token", result.token);
      localStorage.setItem("hm_customer_user", JSON.stringify(result.user));
      navigate("/", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <main className="login-page"><form className="login-card" onSubmit={submit}>
    <Link to="/" className="brand">☀ HAIL MARY</Link>
    <span className="eyebrow">CUSTOMER ACCOUNT</span>
    <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
    <p>{mode === "login" ? "Log in with your email and password to continue to the website." : "Register with your name, email and a password."}</p>
    {error && <div className="error" role="alert">{error}</div>}
    {mode === "register" && <label>Your name<input required autoComplete="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}
    <label>Gmail / Email<input type="email" required autoComplete="email" placeholder="you@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" required minLength="8" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    <button className="button" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</button>
    <button type="button" className="back-link auth-switch" onClick={()=>{setMode(mode === "login" ? "register" : "login");setError("");}}> {mode === "login" ? "New customer? Create an account" : "Already have an account? Login"}</button>
    <Link to="/" className="back-link">← Back to website</Link>
    <small>Business email: {site.email} · Call: {site.phone}</small>
    <Link to="/admin/login" className="back-link admin-login-link">Administrator login</Link>
  </form></main>;
}
