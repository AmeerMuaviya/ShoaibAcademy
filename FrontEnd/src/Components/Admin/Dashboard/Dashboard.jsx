import React from "react";
import "../../Css/Dashboard.scss";
import OtherInfo from "./OtherInfo";
import StudentsInfo from "./StudentsInfo";
import Home from "../../Home";
const Dashboard = () => {
  return (
    <>
      <div className="admin-dashboard">
        <StudentsInfo />
        <OtherInfo />
        <Home />
      </div>
    </>
  );
};

export default Dashboard;
