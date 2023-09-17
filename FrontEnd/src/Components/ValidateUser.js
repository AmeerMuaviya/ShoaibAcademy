import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
const ValidateStudent = ({orgUser}) => {
  const { user } = useContext(AuthContext);
  let res =
    user && user.status === orgUser ? <Outlet /> : <Navigate to="not-found" />;
  return res;
};
export default ValidateStudent;
