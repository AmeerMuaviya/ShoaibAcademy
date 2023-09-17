import React, { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
const ManageAdmins = () => {
  const { showAlert } = useContext(generalContext);
  const [admins, setAdmins] = useState();
  const [inputs, setInputs] = useState({
    username: "",
    fullName: "",
    password: "",
  });
  const [uid, setUid] = useState(null);
  useEffect(() => {
    getAdmins();
  }, []);
  function getAdmins() {
    axios.get("/admins/all").then((response) => {
      setAdmins(response.data.admins);
    });
  }
  function deleteAdmin(uid) {
    axios.delete(`/admins/delete/${uid}`).then((response) => {
      response.data.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      getAdmins();
    });
  }
  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  function notAlreadyExists() {
    let check = admins.filter(
      (value) => value.username === inputs.username && value.uid !== uid
    );
    return !check.length;
  }
  function reset() {
    setInputs({ username: "", fullName: "", password: "" });
    setUid(null);
  }
  function addAdmin(e) {
    e.preventDefault();
    if (uid) {
      if (notAlreadyExists()) {
        axios
          .post(`/admins/update/${uid}`, { data: inputs })
          .then((response) => {
            let type = response.data.err ? "warning" : "success";
            showAlert(type, response.data.msg);
            getAdmins();
            reset();
          });
      }
      return;
    }
    axios.post("/admins/add", inputs).then((response) => {
      response.data.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      getAdmins();
      reset();
      e.target.reset();
    });
  }
  function handleUpdate(uid) {
    let ads = admins.filter((value) => value.uid === uid)[0];
    setInputs({ username: ads.username, fullName: ads.fullName, password: "" });
    setUid(uid);
  }
  return (
    <div className="container my-4" onSubmit={addAdmin}>
      <h1 className="page-heading">Manage admins</h1>
      <form className="special-form mx-auto my-3 stdform ">
        <input
          type="text"
          className="stdform-item"
          required
          onChange={handleChange}
          placeholder="Enter Username"
          name="username"
          value={inputs.username}
        />
        <input
          type="text"
          className="stdform-item"
          required
          onChange={handleChange}
          placeholder="Enter full name (must include Sir/Ma'am)"
          name="fullName"
          value={inputs.fullName}
        />
        <input
          type="text"
          className="stdform-item"
          required={!uid}
          onChange={handleChange}
          name="password"
          id="mypass"
          value={inputs.password || ""}
          placeholder="Enter password"
        />
        <div>
          {uid && (
            <button
              type="button"
              onClick={reset}
              className="btn btn-secondary mx-1"
            >
              Cancel
            </button>
          )}
          <input
            type="submit"
            value={uid ? "Update" : "Add New Admin"}
            className="btn btn-primary mx-1"
          />
        </div>
      </form>
      <h2 className="page-heading-2" >List of all admins</h2>
      <table className="table table-success">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins &&
            admins.map((value, index) => (
              <tr key={index}>
                <td>{value.username}</td>
                <td>{value.fullName}</td>
                <td>
                  {admins.length <= 1 ? (
                    "Can't modify last admin"
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAdmin(value.uid)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(value.uid)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAdmins;
