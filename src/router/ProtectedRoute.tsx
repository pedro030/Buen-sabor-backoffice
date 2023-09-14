import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  isAllowed,
  children,
}: any) => {
  if (!isAllowed) {
    return <Navigate to='/' replace />;
  }

  return children ? children : <Outlet />;
};
