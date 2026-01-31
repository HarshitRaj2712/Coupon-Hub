import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { isAdmin } from "../utils/auth";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
