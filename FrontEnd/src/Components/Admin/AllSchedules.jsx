import axios from "../../axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { generalContext } from "../../contexts/generalContext";
import { UUID } from "uuidjs"; // to provide unique id to each element
import { AuthContext } from "../../contexts/authContext";
const AllSchedules = ({ state }) => {
  let { showAlert, capitallizeFirstLetter, classes } =
    useContext(generalContext);
  const allClassesNames = classes.map((value) => value.className);
  let { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  let fetchSchedules = async () => {
    let url = "/schedules/getAllSchedules";
    if (state === "trashed") url = "/schedules/trashed";
    let response = await axios.get(url);
    setSchedules(response.data.schedules);
    setFilteredSchedules(response.data.schedules);
  };
  useEffect(() => {
    fetchSchedules();
    //eslint-disable-next-line
  }, [state]);

  function moveToTrash(sid) {
    axios.post(`/schedules/disableSchedule/${sid}`).then((response) => {
      response.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      fetchSchedules();
    });
  }

  function recoverFromTrash(sid) {
    axios.post(`/schedules/enableSchedule/${sid}`).then((response) => {
      response.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      fetchSchedules();
    });
  }
  function deletePermanantly(sid) {
    axios.delete(`/schedules/deleteSchedule/${sid}`).then((response) => {
      response.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      fetchSchedules();
    });
  }
  function getStatus(checked, date) {
    date = new Date(date);
    if (checked || date <= new Date())
      return <span className="btn btn-primary bi bi-check-lg"> Conducted</span>;
    else
      return (
        <span className="btn btn-warning bi bi-clock-history"> Pending</span>
      );
  }

  function getTools(result, sid, date, subject) {
    subject = Object.keys(subject);
    let checked = [];
    let unchecked = [];
    subject.forEach((value) => {
      if (value in result) checked.push(value);
      else unchecked.push(value);
    });
    let data = [];
    if (unchecked.length) {
      if (unchecked.length === 1) {
        data.push(
          <Link
            key={UUID.generate()}
            className="btn btn-warning"
            to={`/${capitallizeFirstLetter(user.status)}/add-marks`}
            state={{ sid, date, subject: unchecked[0] }}
          >
            <i className="bi bi-plus-lg"></i>
            {unchecked[0]}
          </Link>
        );
      } else {
        data.push(
          <div key={UUID.generate()} className="dropdown">
            <button
              className="btn btn-warning dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Add Marks of
            </button>
            <ul className="dropdown-menu">
              {unchecked.map((value) => (
                <li key={UUID.generate()}>
                  {
                    <Link
                      className="dropdown-item"
                      to={`/${capitallizeFirstLetter(user.status)}/add-marks`}
                      state={{ sid, date, subject: value }}
                    >
                      {value}
                    </Link>
                  }
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }
    if (checked.length) {
      if (checked.length === 1) {
        data.push(
          <div key={UUID.generate()}>
            <Link
              title="View  Marks"
              className="btn btn-info"
              to={`/${capitallizeFirstLetter(user.status)}/view-marks`}
              state={{ sid, date, subject: checked[0], view: true }}
            >
              <i className="bi bi-eye"></i> {checked[0]}
            </Link>
            <Link
              title="Update Marks"
              className="btn btn-primary"
              to={`/${capitallizeFirstLetter(user.status)}/view-marks`}
              state={{ sid, date, subject: checked[0] }}
            >
              <i className="bi bi-arrow-counterclockwise"></i> {checked[0]}
            </Link>
          </div>
        );
      } else {
        data.push(
          <div key={UUID.generate()}>
            <div className="dropdown">
              <button
                className="btn btn-info dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-eye"></i> View
              </button>
              <ul className="dropdown-menu">
                <li>
                  {
                    <Link
                      className="dropdown-item"
                      to={`/${capitallizeFirstLetter(user.status)}/view-marks`}
                      state={{ sid, date, subject: "all", view: true }}
                    >
                      All
                    </Link>
                  }
                </li>
                {checked.map((value, index) => (
                  <li key={UUID.generate()}>
                    {
                      <Link
                        className="dropdown-item"
                        to={`/${capitallizeFirstLetter(
                          user.status
                        )}/view-marks`}
                        state={{ sid, date, subject: value, view: true }}
                      >
                        {value}
                      </Link>
                    }
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-success dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-arrow-counterclockwise"></i> Update
              </button>
              <ul className="dropdown-menu">
                {checked.map((value, index) => (
                  <li key={UUID.generate()}>
                    {
                      <Link
                        className="dropdown-item"
                        to={`/${capitallizeFirstLetter(
                          user.status
                        )}/view-marks`}
                        state={{ sid, date, subject: value }}
                      >
                        {value}
                      </Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
    }
    return data;
  }
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  function handleSearchChange(e) {
    if (e.target.value === "") {
      return setFilteredSchedules(schedules);
    }
    let _filteredSchedules = schedules.filter(
      (value) => value.className === e.target.value
    );
    setFilteredSchedules(_filteredSchedules);
  }
  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <h1 className="page-heading">
          {capitallizeFirstLetter(state)} Schedules
        </h1>
        <select
          onChange={handleSearchChange}
          className="form-select form-select-lg mb-3 stdform-item"
          aria-label="Large select example"
          defaultValue={""}
        >
          <option value="">All</option>
          {allClassesNames.map((value, index) => {
            return (
              <option key={index + value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
      {!filteredSchedules || !filteredSchedules.length ? (
        <h3 className="text-secondary text-center">No Schedules Found!</h3>
      ) : null}
      {filteredSchedules &&
        filteredSchedules.map((fvalue, index) => {
          return (
            <div
              key={UUID.generate()}
              id={"sid" + fvalue.sid}
              className="my-5 p-3 shadow-lg w-max"
            >
              {state === "trashed" ? (
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-success bi bi-arrow-clockwise"
                    onClick={() => recoverFromTrash(fvalue.sid)}
                  >
                    {" "}
                    Recover from trash
                  </button>
                  <button
                    className="btn btn-danger bi bi-trash3-fill"
                    onClick={() => deletePermanantly(fvalue.sid)}
                  >
                    {" "}
                    Delete Permanantly
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  <Link
                    className="btn btn-primary bi bi-arrow-repeat"
                    to={`/${capitallizeFirstLetter(user.status)}/add-schedule`}
                    state={fvalue}
                  >
                    {" "}
                    Update
                  </Link>
                  {user.status !== "Teacher" && (
                    <Link
                      className="btn btn-primary bi bi-printer-fill"
                      to={`/${capitallizeFirstLetter(
                        user.status
                      )}/view-print-info`}
                      state={fvalue}
                    >
                      {" "}
                      Print Result
                    </Link>
                  )}
                  <button
                    className="btn btn-warning bi bi-trash3-fill"
                    onClick={() => moveToTrash(fvalue.sid)}
                  >
                    {" "}
                    Move to trash
                  </button>
                </div>
              )}
              <table
                className={
                  state === "trashed"
                    ? "table table-light disabled-div"
                    : "table table-light"
                }
                style={{ border: "2px solid transparent" }}
              >
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
                            <th>Subject(s)</th>
                            <th>Sullybus</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(fvalue.data).map((value, index) => {
                            return (
                              <tr
                                key={UUID.generate()}
                                className={
                                  formatDate(new Date(value.date)) ===
                                  formatDate(new Date())
                                    ? "text-success fw-bolder fs-5"
                                    : ""
                                }
                              >
                                <td>{value.date}</td>
                                <td>{value.day}</td>
                                <td>{Object.keys(value.subject).join("-")}</td>
                                <td>
                                  {" "}
                                  {Object.values(value.subject).join(" - ")}
                                </td>
                                <td>
                                  {getStatus(value.isChecked, value.date)}
                                </td>
                                <td className="td-tools">
                                  {getTools(
                                    value.result,
                                    fvalue.sid,
                                    value.date,
                                    value.subject
                                  )}
                                </td>
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
        })}
    </div>
  );
};

export default AllSchedules;
