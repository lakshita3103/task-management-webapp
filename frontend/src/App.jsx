import { Navigate, Route, Routes } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import LoadingState from "./components/LoadingState";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import BoardsPage from "./pages/BoardsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Register";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Loading TaskFlow..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/boards" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
