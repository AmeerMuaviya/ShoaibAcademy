import axios from "../../axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generalContext } from "../../contexts/generalContext";

function RegisteredTeachers({ state }) {
  const [data, setData] = useState([]);
  let { url, showAlert } = useContext(generalContext);
  let fetchData = async () => {
    let res = await axios.get(
      state === "trashed" ? "/teachers/trashed" : "/teachers/all"
    );
    setData(res.data);
    setFilteredarray(res.data);
  };
  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, [state]);
  const [query, setQuery] = useState("");
  const [filteredarray, setFilteredarray] = useState(data);
  useEffect(() => {
    let a = data.filter((value) => {
      return (
        value.username
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()) ||
        value.fullName.toLocaleLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredarray(a);
    return () => {
      // Cleanup Function
      setFilteredarray(data);
    };
    // eslint-disable-next-line
  }, [query]);
  function moveToTrash(uid) {
    axios.delete(`/teachers/moveToTrash/${uid}`).then((res) => {
      if (res.data.err) showAlert("warning", res.data.msg);
      else showAlert("success", res.data.msg);
      fetchData();
    });
  }
  function recoverTeacher(uid) {
    axios.post(`/teachers/recover/${uid}`).then((response) => {
      if (response.data.err) return showAlert("warning", response.data.msg);
      showAlert("success", response.data.msg);
      fetchData();
    });
  }
  function deleteTeacher(uid) {
    axios.delete(`/teachers/delete/${uid}`).then((response) => {
      if (response.data.err) return showAlert("warning", response.data.msg);
      showAlert("success", response.data.msg);
      fetchData();
    });
  }
  return (
    <div className="container p-2 my-5 boxShadow rounded position-relative teacherTable">
      <h3 className="fw-bolder d-inline-block mb-0 page-heading">
        Manage Teachers
      </h3>
      {data.length ? (
        <input
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
      ) : null}
        <table className="table mx-auto teacherTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Picture</th>
              <th>Name</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredarray.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
                    <img
                      className="teacherProfilePicture"
                      src={
                        parseInt(value.dp)
                          ? `${url}/getfile/${value.dp}`
                          : value.gender === "Male"
                          ? `/images/profile-boy.webp`
                          : "/images/profile-girl.jpg"
                      }
                      alt=""
                      style={{ borderRadius: "100%" }}
                    />
                  </td>
                  <td>{value.fullName}</td>
                  <td>{value.age}</td>
                  <td>
                    {state === "trashed" ? (
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <button
                          className="btn btn-success bi bi-arrow-clockwise"
                          name="recover"
                          onClick={() => {
                            recoverTeacher(value.uid);
                          }}
                        >
                          {" "}
                          Recover Teacher
                        </button>
                        <button
                          name="delete"
                          className="btn btn-danger bi bi-trash3-fill"
                          onClick={() => {
                            deleteTeacher(value.uid);
                          }}
                        >
                          Delete permanantly
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <Link
                          className="btn btn-primary wide-btn bi bi-pencil-square"
                          to={`/Admin/add-teacher/?edit=${value.uid}`}
                          state={value}
                        >
                          {" "}
                          Edit
                        </Link>
                        <button
                          className="btn btn-warning wide-btn bi bi-trash3-fill"
                          onClick={() => moveToTrash(value.uid)}
                        >
                          {" "}
                          Move to trash
                        </button>
                        <Link
                          className="btn btn-success wide-btn bi bi-three-dots"
                          to={`/Admin/view-teacher/${value.uid}`}
                          state={value}
                        >
                          {" "}
                          Details
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      {!filteredarray.length ? <h1 className="text-secondary text-center">Nothing to show</h1>: null}
    </div>
  );
}
export default RegisteredTeachers;