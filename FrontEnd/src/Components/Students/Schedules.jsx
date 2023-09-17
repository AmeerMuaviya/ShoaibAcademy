import axios from "../../axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../../contexts/authContext";
import { useLocation } from "react-router-dom";

const AllSchedules = () => {
  let state = useLocation().state;
  let { user } = useContext(AuthContext);
  if (state) user = state;
  const [schedules, setSchedules] = useState([]);
  let fetchSchedules = async () => {
    let a = await axios.get(
      state
        ? `/schedules/getSchedulesByStudentId/${state.uid}`
        : `/schedules/getSchedulesByStudentId/${user.uid}`
    );
    setSchedules(a.data.schedules);
  };
  useEffect(() => {
    fetchSchedules();
    //eslint-disable-next-line
  }, []);

  function getStatus(checked, date) {
    date = new Date(date);
    if (checked || date <= new Date())
      return <span className="btn btn-primary">Conducted</span>;
    else return <span className="btn btn-warning">Pending</span>;
  }
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  function getMarks(result) {
    const obj = [];
    for (const [, value] of Object.entries(result)) {
      value.forEach((item) => {
        if (item.uid === user.uid) {
          obj.push(`${item.totalMarks}/${item.obtainedMarks}`);
        }
      });
    }
    if (!obj.length) return "Pending...";
    return obj.map((value) => (
      <p key={value} className="m-0">
        <u>{value}</u>
      </p>
    ));
  }

  return (
    <div className="container my-3">
      <h1 className="page-heading">All Shedules</h1>
      {!schedules.length ? (
        <h3 className="text-secondary">No Schedules Found!</h3>
      ) : (
        schedules.map((fvalue, index) => {
          return (
            <div key={index} id={fvalue.sid} className="my-5 p-3 shadow-lg">
              <table className="table table-light">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Class</th>
                    <th>Test Type</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{fvalue.teacherName}</td>
                    <td>{fvalue.className}</td>
                    <td>{fvalue.testType}</td>
                    <td>
                      {moment(
                        new Date(fvalue.publishingTime),
                        "YYYYMMDDHHmm"
                      ).fromNow()}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="6">
                      <table
                        className="table table-primary my-3"
                        style={{ border: "4px  black double" }}
                      >
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Sullybus</th>
                            <th>Status</th>
                            <th>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(fvalue.data).map((value, index) => {
                            return (
                              <tr key={index} className={formatDate(new Date(value.date))===formatDate(new Date())?'text-success fw-bolder fs-5':''}>
                                <td>{value.date}</td>
                                <td>{value.day}</td>
                                <td>{Object.keys(value.subject).join(", ")}</td>
                                <td>
                                  {Object.values(value.subject).join(", ")}
                                </td>
                                <td>
                                  {getStatus(value.isChecked, value.date)}
                                </td>
                                <td>{getMarks(value.result)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AllSchedules;
