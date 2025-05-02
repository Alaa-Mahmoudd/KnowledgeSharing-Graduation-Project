import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const ProtectedRoute = (props) => {
  const { user } = useUser();

  if (user) {
    return props.children;
  }
  else {
    return <Navigate to={'/login'} />
  }
}

export default ProtectedRoute;