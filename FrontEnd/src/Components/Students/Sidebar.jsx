import React, { useContext, useEffect } from "react";
import "../Css/StudentsSection.css";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { generalContext } from "../../contexts/generalContext";
import axios from "../../axiosInstance";
const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [scount, setScount] = useState(0);
  const { nCounts, setNCounts, url } = useContext(generalContext);
  const [sidebar, setSidebar] = useState(false);
  useEffect(() => {
    axios.get(`/schedules/todaysTests/${user.class}`).then((response) => {
      setScount(response.data.length);
    });
  }, [user.class]);
  let toggleSidebar = () => setSidebar(!sidebar);
  useEffect(() => {
    let listener = () => {
      setSidebar(false);
    };
    let element = document.getElementsByClassName("sidebarElem");
    Array.from(element).forEach((elem) => {
      elem.addEventListener("click", listener);
    });

    return () => {
      Array.from(element).forEach((elem) => {
        elem.removeEventListener("click", listener);
      });
    };
  }, [sidebar]);
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };
  useEffect(() => {
    axios
      .get(`/notifications/getNotificatoinsCount/${user.uid}`)
      .then((response) => {
        setNCounts(response.data.count);
      });
    //eslint-disable-next-line
  }, [user.uid]);

  return (
    <>
      <nav className="navbar studentNav navbar-sticky bg-light px-2 shadow-lg sticky-top">
        <div onClick={toggleSidebar} className="hamburger">
          <h2>
            <i className="bi bi-list"></i>
          </h2>
        </div>
        <div>
          <span className="title" title="Brand name">
            <Link to="/Student" className="" style={{ color: "inherit" }}>
              Shoaib Academy
            </Link>
          </span>
          <Link to={"/Student"}>
            <span className="logo">
              <img
                src="/android-chrome-512x512.png"
                alt="logo"
                style={{ borderRadius: "100%", width: "50px", height: "50px" }}
              />
            </span>
          </Link>
        </div>
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
          <Link to="/Student/notifications" type="button" className="">
            <span
              title="Notifications"
              className="bi bi-bell-fill special-icon fs-3 position-relative"
            >
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
            </span>

            <span className="visually-hidden">unread messages</span>
          </Link>
          <Link to="/Student/schedules" type="button" title="Today's test">
            <span
              type="button"
              className="bi bi-clipboard2-data-fill m-icon fs-3 position-relative"
              style={{ cursor: "pointer" }}
            >
              {scount ? (
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
                  {scount}
                </p>
              ) : null}
              <span className="visually-hidden">unchecked tests</span>
            </span>
          </Link>
          <Link to="about-me">
            <img
              title="My Profile"
              src={
                parseInt(user.dp)
                  ? `${url}/getfile/${user.dp}`
                  : user.gender === "Male"
                  ? `/images/profile-boy.webp`
                  : "/images/profile-girl.jpg"
              }
              alt=""
              style={{ borderRadius: "100%", width: "50px", height: "50px" }}
            />
          </Link>
        </div>
      </nav>
      <div id="Sidebar" className={sidebar ? "showSidebar" : "hideSidebar"}>
        <div className="header d-flex justify-content-between align-items-center flex-wrap">
          <h2>
            <button
              type="button"
              onClick={toggleSidebar}
              className="hide bi bi-list"
            ></button>
          </h2>
          <h4
            className="d-inline fw-bolder small-title mx-2"
            title="Brand name"
          >
            {user.fullName}
          </h4>
        </div>
        <hr />
        <ul className="scroller p-0">
          <Link to="" className="li sidebarElem">
            <i className="bi bi-house-fill"></i>Home
          </Link>
          <Link to="schedules" className="li sidebarElem">
            <i className="bi bi-calendar-check"></i>Schedules
          </Link>
          <Link to="notifications" className="li sidebarElem">
            <i className="bi bi-app-indicator"></i>Notifications
            {nCounts >= 1 && (
              <span className="bg-danger badge mx-2">{nCounts}</span>
            )}
          </Link>
          <Link to="notes" className="li sidebarElem">
            <i className="bi bi-stickies-fill"></i>Notes
          </Link>
          <Link to="change-password" className="li sidebarElem">
            <i className="bi bi-shield-lock-fill"></i>Change Password
          </Link>
          <Link to="about-me" className="li sidebarElem">
            <i className="bi bi-person-bounding-box"></i>My Account
          </Link>
          <span
            role={"button"}
            type="button"
            className="li sidebarElem"
            onClick={handleLogout}
          >
            <i className="bi bi-arrow-left-square"></i>Logout
          </span>
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default Sidebar;
