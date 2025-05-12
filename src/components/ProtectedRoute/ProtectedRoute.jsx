import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return null; // أو loading spinner لو حابب
  }

  if (user?.token) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
