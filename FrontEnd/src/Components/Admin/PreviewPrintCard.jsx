import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import "../Css/result.css";
import moment from "moment";
const PreviewPrintCard = () => {
  const navigate = useNavigate();
  //eslint-disable-next-line
  const [students, setStudents] = useState([]);
  const data = useLocation().state;
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/students/getStudentsByList", {
        list: data,
      });
      setStudents(response.data);
    };
    fetchData();
  }, [data]);

  return (
    <div className="min-vh-100 border-0 p-0 m-0">
      <button
        className="btn-close position-absolute justify-content-center align-items-center rounded-5 left-0 bg-c-secondary text-dark"
        style={{ width: "50px", height: "50px", top: "10px", left: "10px" }}
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" style={{ fontSize: "40px" }}></i>
      </button>
      <h1 className="hide-when-print page-heading font-weight-bold text-primary text-center">
        Hit `ctrl+p` to print cards
      </h1>
      {!students || !students.length ? (
        <h2 className="text-secondary text-center">No data found :(</h2>
      ) : null}
      {students.map((student, index) => (
        <div
          key={index}
          className="card mb-4 mx-auto d-flex p-0 border-0 justify-content-center align-items-center rounded-0 print-card"
          style={{ minHeight: "250px", width: "650px" }}
        >
          <div class="position-relative">
            <p className="position-absolute"></p>
            <h5
              className="name position-absolute text-center"
              style={{
                top: "310px",
                left: "25px",
                width: "150px",
                height: "30px",
              }}
            >
              {student.username}
            </h5>
            <h5
              className="name position-absolute"
              style={{ top: "155px", left: "341px" }}
            >
              {student.fullName}
            </h5>
            <h5
              className="name position-absolute"
              style={{ top: "190px", left: "367px" }}
            >
              {student.fatherName}
            </h5>
            <h5
              className="name position-absolute"
              style={{ top: "228px", left: "327px" }}
            >
              {student.class}
            </h5>
            <h5
              className="name position-absolute"
              style={{ top: "265px", left: "359px" }}
            >
              {moment(student.joiningDate).format("MMM DD, YYYY")}
            </h5>
            <div
              className="position-absolute"
              style={{
                width: "170px",
                height: "170px",
                top: "139px",
                left: "22px",
              }}
            >
              <img
                src={
                  Number(student.dp)
                    ? student.dp
                    : student.gender === "Male"
                    ? "/images/profile-boy.webp"
                    : "/images/profile-girl.jpg"
                }
                alt="user"
              />
            </div>
            <img
              src="/images/card-layout.png"
              class="card-img rounded-0"
              alt="..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPrintCard;
