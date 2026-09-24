import {useContext} from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ element: Element }) => {
    let {user} = useContext(AuthContext)
    const location = useLocation()
  return user ? (
    <Element />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
