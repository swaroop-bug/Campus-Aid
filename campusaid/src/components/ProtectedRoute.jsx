// src/components/ProtectedRoute.jsx
import React from "react";

export default function ProtectedRoute({ isAuthenticated, children, redirectTo }) {
  if (!isAuthenticated) {
    redirectTo('login');
    return null;
  }
  return children;
}
