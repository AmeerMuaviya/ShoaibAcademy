import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "../Css/Layout.scss";
import AdminSidebar from "./AdminSidebar";
import Navbar from "./Dashboard/Navbar";
function Layout() {
  const [sidebar, setSidebar] = useState(false);
  useEffect(() => {
    function handleCtrlBKeyPress(event) {
      if (event.ctrlKey && event.key === "b") {
        setSidebar(prev=>!prev)
      }
    }
    document.addEventListener("keydown", handleCtrlBKeyPress);
    return () => {
      document.removeEventListener("keydown", handleCtrlBKeyPress);
    };
  }, []);
  return (
    <>
      <div className="layout">
        <AdminSidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="content">
          <Navbar sidebar={sidebar} setSidebar={setSidebar} />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
