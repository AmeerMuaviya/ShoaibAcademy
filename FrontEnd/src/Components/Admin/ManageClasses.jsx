import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { generalContext } from "../../contexts/generalContext";
import Modal from "../Modal";
import useFetchSubjects from "../useFetchSubjects";

const ManageClasses = () => {
  let subjects = useFetchSubjects();
  const [allClasses, setAllClasses] = useState();
  let { showAlert, setClasses } = useContext(generalContext);
  const [subject, setSubject] = useState([]);
  const [state, setState] = useState(null);
  const [id, setId] = useState();
  function getData() {
    axios.get("/classes/getAllClasses").then((response) => {
      setAllClasses(response.data.classes);
      setClasses(response.data.classes);
    });
  }
  const [data, setData] = useState({
    className: "",
    subjects: "",
  });
  useEffect(() => {
    getData();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (state !== null) {
      let subjs = allClasses.filter((value) => value.id === state)[0];
      setData({ ...data, className: subjs.className });
      subjs = JSON.parse(subjs.subjects);
      setSubject(subjs);
    }
    //eslint-disable-next-line
  }, [state, allClasses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.length) return showAlert("warning", "No subjects selected");
    data.subjects = JSON.stringify(subject);
    if (state !== null) {
      axios.post(`/classes/update/${state}`, data).then((value) => {
        let responseState = value.data.err ? "warning" : "success";
        showAlert(responseState, value.data.msg);
        getData();
        e.target.reset();
      });
    } else {
      axios.post("/classes/add-class", data).then((value) => {
        let responseState = value.data.err ? "warning" : "success";
        showAlert(responseState, value.data.msg);
        getData();
        e.target.reset();
      });
    }
    reset();
  };
  function handleInputchange(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }
  function changeSbj(value) {
    let _sub = [...subject];
    if (!_sub.includes(value)) {
      _sub.push(value);
    } else {
      let index = _sub.indexOf(value);
      if (index > -1) {
        _sub.splice(index, 1);
      }
    }
    console.log(_sub)
    setSubject(_sub);
  }
  function reset() {
    setSubject([]);
    setData({ ...data, className: "" });
    setState(null);
  }
  function handleDelete() {
    if (id) {
      axios.delete(`/classes/delete/${id}`).then((value) => {
        let responseState = value.data.err ? "warning" : "success";
        showAlert(responseState, value.data.msg);
        getData();
      });
    }
  }
  return (
    <div className="container my-5">
      <Modal
        modalType="modal-dialog modal-dialog-centered"
        title="Are you sure ?"
        onSaveType="btn btn-danger"
        onSaveText="Yes! Delete"
        body={
          <p className="text-center">
            Please confirm before proceeding as it cannot be undone.
          </p>
        }
        onSave={handleDelete}
        modalId="confirmDelete"
      />
      <h1 className="fw-bolder page-heading">Add Class</h1>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="form-floating mb-4 w-100 mx-auto">
          <input
            type="text"
            required
            onChange={handleInputchange}
            className="form-control fs-4"
            id="className"
            defaultValue={data.className}
          />
          <label htmlFor="className">Enter Class Name:</label>
        </div>
        <div className="mb-3 mx-auto d-flex align-items-center justify-content-center gap-2 flex-wrap">
          {subjects.map((value, index) => (
            <div key={index}>
              <span
                role={"checkbox"}
                aria-checked="false"
                onClick={() => changeSbj(value)}
                className={
                  subject.includes(value)
                    ? "sbj-btn selected-sbj"
                    : "sbj-btn unselected-sbj"
                }
              >
                {value}{" "}
                {subject.includes(value) ? (
                  <i className="bi bi-x-lg"></i>
                ) : (
                  <i className="bi bi-plus-lg"></i>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center gap-4 mx-auto">
          {state && (
            <button className="btn btn-secondary" onClick={reset}>
              Cancel
            </button>
          )}
          <button className="btn btn-primary" type="submit">
            <i
              className={
                state === null ? "bi bi-plus-lg" : "bi bi-arrow-clockwise"
              }
            ></i>
            {state === null ? "Add Class" : "Update Data"}
          </button>
        </div>
      </form>
      <table className="table table-success mt-4">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allClasses &&
            allClasses.map((value, index) => (
              <tr key={index}>
                <td>{value.className}</td>
                <td>{JSON.parse(value.subjects).join(" - ")}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary bi bi-arrow-clockwise"
                    onClick={() => setState(value.id)}
                  >
                    {" "}
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger bi bi-trash3-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmDelete"
                    onClick={() => setId(value.id)}
                  >
                    {" "}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {allClasses && !allClasses.length && (
            <tr>
              <td colSpan={3} className="fs-2 text-secondary text-center">
                Nothing found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        to="/Admin/update-subjects"
        role={"button"}
        className="btn btn-primary block-btn w-25 my-4 bi bi-arrow-clockwise"
      >
        {" "}
        Update Total Subjects
      </Link>
    </div>
  );
};

export default ManageClasses;
