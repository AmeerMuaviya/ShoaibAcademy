import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Css/ViewStd.scss";
import moment from "moment";
import axios from "../../axiosInstance";

import { generalContext } from "../../contexts/generalContext";

const ViewStd = () => {
  const [imageURL, setImageURL] = useState(
    "/images/educationalBackground3.webp"
  );

  useEffect(() => {
    fetch("https://source.unsplash.com/random/1200x600?books")
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok");
      })
      .then((blob) => {
        setImageURL(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, []);

  const data = useLocation().state;
  let navigate = useNavigate();
  let { capitallizeFirstLetter, url, showAlert } = useContext(generalContext);
  const moveToTrash = (id) => {
    axios.delete(`/students/moveToTrash/${id}`).then((res) => {
      if (res.data.err) return showAlert("warning", res.data.msg);
      showAlert("success", res.data.msg);
      navigate("/Admin/all-students");
    });
  };
  return (
    <>
      <div className="container my-2">
        <div
          className="d-flex align-items-center"
          style={{
            backgroundImage: `url(${imageURL})`,
            height: "400px",
            verticalAlign: "center",
            backgroundSize: "cover",
          }}
        >
          <img
            src={
              parseInt(data.dp)
                ? `${url}/getfile/${data.dp}`
                : data.gender === "Male"
                ? `/images/profile-boy.webp`
                : "/images/profile-girl.jpg"
            }
            className="big-dp"
            alt="User Profile"
          />
        </div>
        <div className="detailsTable p-3">
          <div className="main-intro d-flex justify-content-between">
            <h1>{capitallizeFirstLetter(data.username)}</h1>

            <div className="icons">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle shadow bi bi-gear operations-btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  Operations
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/Admin/add-student/?edit=${data.uid}`}
                      state={data}
                    >
                      Edit
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => moveToTrash(data.uid)}
                    >
                      Delete
                    </button>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      state={{ uid: data.uid }}
                      to="sent-notifications"
                    >
                      Sent Notifications
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="sent-notes"
                      state={{ uid: data.uid }}
                    >
                      Sent Notes
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="sent-schedules"
                      state={{ class: data.class, uid: data.uid }}
                    >
                      Schedules & Marks
                    </Link>
                  </li>
                </ul>
              </li>
            </div>
          </div>
          <table className="table mt-5 shadow-lg mb-4 special-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="data">{data.username}</th>
              </tr>
              <tr>
                <th>Full Name</th>
                <th>{data.fullName}</th>
              </tr>
              <tr>
                <th>Father Name</th>
                <th>{data.fatherName}</th>
              </tr>
              <tr>
                <th>Uid</th>
                <th>{data.uid}</th>
              </tr>
              <tr>
                <th>Age</th>
                <th>{data.age}</th>
              </tr>
              <tr>
                <th>Gender</th>
                <th>{data.gender}</th>
              </tr>
              <tr>
                <th>Class</th>
                <th>{data.class}</th>
              </tr>
              <tr>
                <th>Fee</th>
                <th>{data.fee}</th>
              </tr>
              <tr>
                <th>Fee Status</th>
                <th
                  className={
                    data.feeStatus.toLowerCase() === "unpaid"
                      ? "text-warning"
                      : "text-success"
                  }
                >
                  {capitallizeFirstLetter(data.feeStatus)}
                </th>
              </tr>
              <tr>
                <th>Phone Number</th>
                <th>{data.phoneNumber}</th>
              </tr>
              <tr>
                <th>Guardian Phone Number</th>
                <th>{data.guardianPhoneNumber}</th>
              </tr>
              <tr>
                <th>Student Phone Number</th>
                <th>{data.studentPhoneNumber}</th>
              </tr>
              <tr>
                <th>Email</th>
                <th>{data.email}</th>
              </tr>
              <tr>
                <th>Address</th>
                <th>{data.address}</th>
              </tr>
              <tr>
                <th>Joined</th>
                <th>
                  {moment(new Date(data.joiningDate)).format("DD MMM, YYYY")}
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewStd;
