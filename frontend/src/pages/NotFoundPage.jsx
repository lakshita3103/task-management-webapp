import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="not-found-page">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>The page you requested does not exist in this React frontend.</p>
        <Link className="primary-button primary-button--inline" to={isAuthenticated ? "/boards" : "/login"}>
          {isAuthenticated ? "Go to boards" : "Go to login"}
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
