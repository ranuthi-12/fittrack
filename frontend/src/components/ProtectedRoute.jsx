import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute component:
 * Checks if user token exists in localStorage and optional required role.
 * If user isn't logged in, redirects to /login.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("fittrack_token");
  const storedUser = localStorage.getItem("fittrack_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Check if authenticated
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role.toUpperCase())) {
    // Redirect to proper role home if trying to access wrong role page
    if (user.role.toUpperCase() === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role.toUpperCase() === "TRAINER") return <Navigate to="/trainer" replace />;
    return <Navigate to="/member" replace />;
  }

  return <Outlet />;
}
