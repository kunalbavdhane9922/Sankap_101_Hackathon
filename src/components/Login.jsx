import React, { useState } from "react";
import API_BASE_URL from "../config";

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
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      console.log('Login data:', { username: form.username, password: form.password ? '***' : 'missing' });
      
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Response ok:', res.ok);
      
      if (res.ok) {
        // If email is empty, use username as fallback
        const userEmail = data.email || form.username;
        console.log('Setting user email to:', userEmail);
        localStorage.setItem("user.email", userEmail);
        localStorage.setItem("user.username", data.username || form.username);
        localStorage.setItem("user.fullName", data.fullName || data.username || form.username);
        localStorage.setItem("user.profilePhoto", data.profilePhoto || "");
        if (onLogin) onLogin(data);
        // Force redirect to home page
        window.location.href = '/';
      } else {
        console.log('Login failed, error:', data.error);
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
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