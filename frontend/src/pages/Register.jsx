import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form);
      navigate("/boards", { replace: true });
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
              <p className="eyebrow">Get started</p>
              <h2>Create your TaskFlow account</h2>
            </div>
            <span className="auth-card__pill">Premium board control</span>
          </div>
          <p className="auth-copy">Sign up once, then manage only your own boards and tasks across the app.</p>

          {error && <div className="alert error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Name</span>
              <input
                className="text-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </label>

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
                autoComplete="new-password"
              />
            </label>

            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Signup"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default Register;
