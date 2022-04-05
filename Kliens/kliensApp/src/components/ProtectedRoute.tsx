import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import LoggedInContext from "../utils/context";
import AccessDenied from "../pages/AccessDenied";

interface Props {
  component: React.ComponentType
  roles: Array<string>
}

export const ProtectedRoute: React.FC<Props> = ({ component: RouteComponent, roles }) => {
  const { position, setPosition } = useContext(LoggedInContext);
  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const { username, setUsername } = useContext(LoggedInContext);
  
  const userHasAccess = isLoggedIn && roles.includes(position || 'Unknown') ? true : false

  if (isLoggedIn && userHasAccess) {
    return <RouteComponent />
  }

  if (isLoggedIn && !userHasAccess) {
    return <AccessDenied />
  }

  //return <Navigate to="/login" />
  return <Navigate to="/accessdenied" />
};