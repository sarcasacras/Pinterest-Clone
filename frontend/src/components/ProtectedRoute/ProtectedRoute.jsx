import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}