import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
