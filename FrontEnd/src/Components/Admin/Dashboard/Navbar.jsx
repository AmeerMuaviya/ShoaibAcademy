import React, { useContext, useEffect } from "react";
import { generalContext } from "../../../contexts/generalContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/authContext";
import axios from "../../../axiosInstance";
const Navbar = (props) => {
  console.log('props: ', props);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const { setNCounts, nCounts } = useContext(generalContext);
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };
  useEffect(() => {
    axios.get(`/notifyAdmin/get-unseen`).then((response) => {
      setNCounts(response.data.count);
    });
    //eslint-disable-next-line
  }, [user.uid]);
  return (
    <nav className="navbar sticky-top bg-light">
      {!props.sidebar && (
        <button
          onClick={() => props.setSidebar(!props.sidebar)}
          className="hide fs-2"
        >
          <i className="bi bi-list"></i>
        </button>
      )}
      <div className="dash-header title">
        <h1><Link to="/Admin" className="" style={{color:"inherit"}}>Admin Dashboard</Link></h1>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-2">
        <Link to="/Admin/notifications-for-me" type="button" className="">
          <span className="bi bi-bell-fill m-icon fs-3 position-relative">
            {nCounts >= 1 && (
              <p
                className="position-absolute badge m-0 bg-danger d-flex justify-content-center align-items-center"
                style={{
                  fontSize: "15px",
                  padding: "4px",
                  width: "25px",
                  height: "25px",
                  borderRadius: "100%",
                  textAlign: "center",
                  verticalAlign: "center",
                  top: "-13%",
                  left: "38%",
                }}
              >
                {nCounts}
              </p>
            )}
            <span className="visually-hidden">unread messages</span>
          </span>
        </Link>
        <Link to="/Admin/all-schedules" type="button">
          <span
            type="button"
            className="bi bi-clipboard2-data-fill m-icon fs-3 position-relative"
            style={{ cursor: "pointer",marginRight:'12px' }}
          >
           <span className="visually-hidden">unchecked tests</span>
          </span>
        </Link>

        <button
          className="logoutBtn fw-bolder btn btn-primary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
