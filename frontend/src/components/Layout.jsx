import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Layout({ children }) {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div>
            <p className="eyebrow">TaskFlow Workspace</p>
            <h1>Task Management Dashboard</h1>
            <p className="hero-copy">
              Manage boards, lists, and task cards from a modern React frontend backed by secure Express, MongoDB, and JWT authentication.
            </p>
          </div>
          <div className="app-header__actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <div className="user-chip">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <button className="secondary-button secondary-button--auto" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Link className="secondary-button secondary-button--auto" to="/login">
                    Login
                  </Link>
                )}
                {location.pathname !== "/register" && (
                  <Link className="primary-button primary-button--inline primary-button--auto" to="/register">
                    Signup
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export default Layout;
