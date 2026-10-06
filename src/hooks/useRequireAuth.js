import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (action, message = "Please log in or sign up to continue.") =>
      (...args) => {
        if (isAuthenticated) return action(...args);
        navigate("/login", {
          state: { message, from: location.pathname + location.search },
        });
      },
    [isAuthenticated, navigate, location]
  );
}