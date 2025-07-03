import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.email) {
        localStorage.setItem("user.email", data.email);
        if (onLogin) onLogin(data);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #0001" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username or Email" value={form.username} onChange={handleChange} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#7d4cff", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
} 