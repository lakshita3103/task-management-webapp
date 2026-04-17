
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) {
    return <Navigate to="/boards" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await login(form);
      navigate(location.state?.from?.pathname || "/boards", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="auth-shell">
        <div className="auth-card">
          <div className="auth-card__top">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>Log in to TaskFlow</h2>
            </div>
            <span className="auth-card__pill">Secure access</span>
          </div>
          <p className="auth-copy">Access your boards, lists, and task cards with your secure account.</p>

          {error && <div className="alert error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                className="text-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                className="text-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete="current-password"
              />
            </label>

            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default Login;
