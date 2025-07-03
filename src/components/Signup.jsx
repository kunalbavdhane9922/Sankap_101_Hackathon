import React, { useState } from "react";

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.email) {
        localStorage.setItem("user.email", data.email);
        setSuccess(true);
        if (onSignup) onSignup(data);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #0001" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#7d4cff", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 10 }}>Signup successful! You can now log in.</div>}
      </form>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
} 