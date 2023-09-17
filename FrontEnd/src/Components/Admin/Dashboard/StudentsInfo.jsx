import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "../../../axiosInstance";
import { Link } from "react-router-dom";

const StudentsInfo = () => {
  const [data, setData] = useState([]);
  const [stPercentage, setStPercentage] = useState({});
  useEffect(() => {
    axios.get("/students/studentsInfoGenderWise").then((response) => {
      if (response.data.err) return;
      setData(response.data.admissions);
      setStPercentage(response.data.percentage);
    });
  }, []);
  return (
    <div>
      <h1 className="Fugaz m-5">Admission rate of current year</h1>
      <div className="student-section">
        <div className="graph">
          {data && data.length ? (
            <ResponsiveContainer>
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Boys"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="Girls"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
        <div className="circular-progress-bar">
          <div className=" bar shadow-lg">
            <div className="circular-bar">
              <CircularProgressbar
                styles={buildStyles({
                  textColor: "var(--title-color)",
                  pathColor: "lightgreen",
                  trailColor: "lightgrey",
                })}
                value={stPercentage.femalePercentage}
                text={stPercentage.femalePercentage + "%"}
              />
            </div>
            <p>Total Girls</p>
          </div>

          <div className="bar shadow-lg">
            <div className="circular-bar">
              <CircularProgressbar
                styles={buildStyles({
                  textColor: "var(--title-color)",
                  pathColor: "purple",
                  trailColor: "lightgrey",
                })}
                value={stPercentage.malePercentage}
                text={stPercentage.malePercentage + "%"}
              />
            </div>
            <p>Total Boys</p>
          </div>
          <Link
            type="button"
            to="/Admin/all-students"
            className="btn btn-info w-75 "
          >
            {" "}
            View All Students <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default StudentsInfo;
