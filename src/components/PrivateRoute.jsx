import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Validación simple del token
  if (!token.startsWith("Bearer_")) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
