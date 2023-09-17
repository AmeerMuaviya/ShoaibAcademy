import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import "../Css/result.css";

const ResultTable = () => {
  const navigate = useNavigate();
  const { selectedStudents, inputs } = useLocation().state;
  let { className, testType, fdate, idate, isCollective } = inputs;
  isCollective = parseInt(isCollective);
  const [AllStudents, setAllStudents] = useState([]);
  const [data, setData] = useState();
  function removeNonSimilar(arr1, arr2) {
    return arr1.filter(function (element) {
      return arr2.includes(element);
    });
  }

  function setStudentsByUniqueId(objects) {
    let uniqueIds = [...new Set(objects.map((value) => value.uid))];
    uniqueIds = removeNonSimilar(uniqueIds, selectedStudents);
    let uniqueObjects = [];
    uniqueIds.forEach((value) => {
      uniqueObjects.push(...objects.filter((_value) => _value.uid === value));
    });
    setAllStudents(uniqueObjects);
  }

  function getAllStudents(sid) {
    axios.get(`/schedules/getStudentsOfSchedule/${sid}`).then((response) => {
      setStudentsByUniqueId([...AllStudents, ...response.data.students]);
    });
  }
  useEffect(() => {
    function isBetweenDates(dateStr, startDate, endDate) {
      let date = new Date(dateStr);
      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(endDate);
      endDate.setHours(0, 0, 0, 0);
      return date >= startDate && date <= endDate;
    }
    axios
      .get(
        inputs.sid
          ? `/schedules/getScheduleById/${inputs.sid}`
          : `/schedules/getAllSchedulesByClass/${className}/${testType}`
      )
      .then((response) => {
        let _data = [];
        let schedules = response.data.schedules;
        schedules.forEach((value) => {
          getAllStudents(value.sid);
          JSON.parse(value.data).forEach((value) => {
            if (
              Object.keys(value.result).length &&
              isBetweenDates(value.date, idate, fdate)
            ) {
              _data.push(...Object.values(value.result));
            }
          });
        });
        preparedData(_data);
      });
    //eslint-disable-next-line
  }, [className, fdate, idate, testType]);

  function sortByDate(arr) {
    return arr.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  }
  function preparedData(data) {
    let values = [].concat(...Object.values(data));
    values = sortByDate(values);
    setData(values);
  }
  function sumMarks(arr) {
    const result = [];
    const map = new Map();

    arr.forEach((item) => {
      const key = item.uid + "-" + item.subject;
      if (!map.has(key)) {
        map.set(key, {
          uid: item.uid,
          subject: item.subject,
          totalMarks: 0,
          obtainedMarks: 0,
        });
        result.push(map.get(key));
      }
      map.get(key).totalMarks += parseInt(item.totalMarks);
      map.get(key).obtainedMarks += parseInt(item.obtainedMarks);
    });

    return result;
  }
  function getBody(uid, username) {
    let _data = data.filter(
      (value) => value.uid === uid && value.name === username
    );
    let obtainedMarks = 0;
    let totalMarks = 0;
    _data.forEach((value) => {
      obtainedMarks += parseInt(value.obtainedMarks);
      totalMarks += parseInt(value.totalMarks);
    });
    if (isCollective) _data = sumMarks(_data);
    if (!_data.length)
      return (
        <tr>
          <td colSpan={isCollective ? 3 : 5}>Nothing to show</td>
        </tr>
      );
    return isCollective ? (
      <>
        {_data.map((value, index) => (
          <tr key={index}>
            <th>{value.subject}</th>
            <td>{value.totalMarks}</td>
            <td>{value.obtainedMarks}</td>
          </tr>
        ))}
        {_data.length > 1 && (
          <tr>
            <th className="text-center">Total Marks</th>
            <td>{totalMarks}</td>
            <td>{obtainedMarks}</td>
          </tr>
        )}
      </>
    ) : (
      <>
        {_data.map((value, index) => (
          <tr key={index}>
            <td>{value.subject}</td>
            <td>
              {value.syllabus.length < 20
                ? value.syllabus
                : value.syllabus.slice(0, 20) + "..."}
            </td>
            <td>{value.date}</td>
            <td>{value.totalMarks}</td>
            <td>{value.obtainedMarks}</td>
          </tr>
        ))}
      </>
    );
  }

  function getHeadings() {
    return isCollective ? (
      <tr>
        <th>Subject</th>
        <th>Total Marks</th>
        <th>Obtained Marks</th>
      </tr>
    ) : (
      <tr>
        <th>Subject</th>
        <th>Syllabus</th>
        <th>Date</th>
        <th>Total Marks</th>
        <th>Obtained Marks</th>
      </tr>
    );
  }
  return (
    <div className="container result-main-container">
      <button
        className="btn-close position-absolute justify-content-center align-items-center rounded-5 left-0 bg-c-secondary text-dark"
        style={{ width: "50px", height: "50px", top: "10px", left: "10px" }}
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" style={{ fontSize: "40px" }}></i>
      </button>
      {!AllStudents || !data ? (
        <h1>No data found according to input values</h1>
      ) : (
        AllStudents.map((value, index) => {
          return (
            <div key={index}>
              <div
                className="result-container my-0"
                style={{ minHeight: "100vh" }}
              >
                <div className="result-header">
                  <div className="logo">
                    <img src="/android-chrome-512x512.png" alt="brand logo" />
                  </div>
                  <div className="w-75">
                    <span className="result-heading Abril ">
                      SHOAIB ACADEMY
                      <h2 className="text-center Tiro">
                        of Commerece & Sciences
                      </h2>
                    </span>
                    <p className="result-address fw-bolder  text-center Nastaliq">
                      Address: Mian Mustaqim Park, Near Jamia Masjid
                      Siddiq-e-Akbar Harbanspura, Lahore
                    </p>
                  </div>
                </div>
                <p className="mt-2 result-phone Nastaliq">
                  Contact&nbsp;#&nbsp;0322-8024845
                </p>
                <div className="result-info-section">
                  <h1 className="text-center">
                    {" "}
                    <u>Result Card</u>
                  </h1>
                  <div className="result-info">
                    <div>
                      <p>
                        Name: <span>{value.fullName}</span>
                      </p>
                      <p>
                        Father Name: <span>{value.fatherName}</span>
                      </p>
                    </div>
                    <div>
                      <p>
                        Class: <span>{value.class}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <table className="table table-success result-table">
                  <thead>{getHeadings()}</thead>
                  <tbody>{getBody(value.uid, value.fullName)}</tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ResultTable;
