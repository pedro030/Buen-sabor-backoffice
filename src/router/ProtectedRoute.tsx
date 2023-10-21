import { Navigate, Outlet } from "react-router-dom";
import { IProtectedRoute } from "../interfaces/IProtectedRouteProps";

export const ProtectedRoute = ({
  isAllowed,
  children,
}: IProtectedRoute) => {
  if (!isAllowed) {
    return <Navigate to='/' replace />;
  }

  return children ? <>{ children }</> : <Outlet />;
};
