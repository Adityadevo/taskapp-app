import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span className="mono" style={styles.logoText}>TASKAPP</span>
          <div style={styles.logoDot} />
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your workspace</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 420 },
  logo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 28 },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--accent)", letterSpacing: 2 },
  logoDot: { width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)" },
  title: { fontSize: 26, fontWeight: 600, marginBottom: 6 },
  sub: { color: "var(--muted)", marginBottom: 28, fontSize: 14 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, color: "var(--muted)", fontWeight: 500 },
  error: { background: "#ff617420", border: "1px solid var(--danger)", color: "var(--danger)", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 16 },
  link: { textAlign: "center", marginTop: 20, color: "var(--muted)", fontSize: 14 },
};
