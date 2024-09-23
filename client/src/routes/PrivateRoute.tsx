import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { hasRole, isAuthenticated } from "../services/User.service";

interface PrivateRouteProps {
      role: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
      if (isAuthenticated() && (!role || hasRole(role))) {
            return <Outlet />;
      }  else {
            return <Navigate to="/auth/login" state={{ from: "location" }} />
      }
}

export default PrivateRoute;
