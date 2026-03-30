// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../service/tokenService";

const useAuth = () => {
  const token = getAccessToken();
  return !!token;
};

const ProtectedRoute = () => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
