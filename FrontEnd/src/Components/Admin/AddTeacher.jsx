import React, { useState, useContext } from "react";
import axios from "../../axiosInstance";
import { useLocation } from "react-router-dom";
import { generalContext } from "../../contexts/generalContext";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Modal from "../Modal";
const AddTeacher = () => {
  const navigate = useNavigate();
  const state = useLocation().state;
  const [data, setData] = useState({
    username: state?.username || "",
    fullName: state?.fullName || "",
    fatherName: state?.fatherName || "",
    email: state?.email || "",
    gender: state?.gender || "",
    phone: state?.phone || "",
    sallary: state?.sallary || "",
    address: state?.address || "",
    age: state?.age || "",
    joiningDate: state?(new Date(state.joiningDate)) : new Date(),
    dp: state?.dp || "",
    status: "Teacher",
    password: state?.password || "",
    isActive: true,
  });
  const { showAlert, url } = useContext(generalContext);
  const [_url, setUrl] = useState("");
  const handlePicChanged = (e) => {
    const file = e.target.files[0];
    setUrl(URL.createObjectURL(file));
  };
  const UploadData = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("dp", data.dp);
    let image = await axios.post("/user/uploadDp", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    let allData = { ...data };
    if (data.dp !== state?.dp) {
      allData["dp"] = image.data ? image.data : false;
    }
    try {
      const res2 = state
        ? await axios.put(`/teachers/updateTeacher/${state.uid}`, allData)
        : await axios.post(`/teachers/addTeacher`, allData);
      if (res2.data.err) return showAlert("warning", res2.data.msg);
      let responseState = res2.data.err ? "warning" : "success";
      showAlert(responseState, res2.data.msg);
      if(!res2.data.err) navigate('/Admin/registered-teachers')
    } catch (error) {
      showAlert("warning", error.responseData.err);
    }
    return false;
  };

  function getProfilePicUrl() {
    if (_url === "" && parseInt(data.dp)) return `${url}/getfile/${data.dp}`;
    else if (_url === "" && !parseInt(data.dp)) return "/images/profile-default.jpg";
    else if (_url !== "") return _url;
  }
  function handleChange(e) {
    if (e.target.id === "dp") {
      setData((prev) => ({ ...prev, [e.target.id]: e.target.files[0] }));
      return;
    }
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }
  return (
    <div className="my-1 container std-container">
      <form
        onSubmit={UploadData}
        className="d-flex justify-content-between stdform flex-wrap mx-auto"
      >
        <h1 className="d-block mx-auto fw-bolder my-3 text-white">
          Enter Following details.
        </h1>
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <label htmlFor="dp" className="dp text-center mx-auto d-block">
            <img src={getProfilePicUrl()} alt="Choose profile" />
          </label>
          <strong className="text-center mb-4 text-white" style={{ fontSize: "20px" }}>
            Choose Profile Picture
          </strong>
        </div>
        <input
          type="file"
          name=""
          onChange={(e) => {
            setUrl(e.target.value);
            handlePicChanged(e);
            handleChange(e);
          }}
          id="dp"
          className="d-none stdform-item"
          accept=".jpg,.png,.jpeg"
        />
        <input
          defaultValue={data.username}
          type="text"
          id="username"
          className="form-control mt-0 stdform-item"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          defaultValue={data.fullName}
          type="text"
          placeholder="Full name"
          className="form-control mt-0 stdform-item"
          id="fullName"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          defaultValue={data.fatherName}
          placeholder="Father name"
          id="fatherName"
          onChange={handleChange}
          className="stdform-item"
          required
          />
        <input
          type="number"
          defaultValue={data.age}
          placeholder="Teacher age"
          id="age"
          onChange={handleChange}
          required
          className="stdform-item"
        />
        <input
          type="email"
          defaultValue={data.email}
          placeholder="Email address"
          id="email"
          onChange={handleChange}
          className="stdform-item"
        />

        <select
          defaultValue={data.gender}
          id="gender"
          required
          onChange={handleChange}
          className="stdform-item"
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          defaultValue={data.sallary}
          placeholder="Sallary"
          id="sallary"
          onChange={handleChange}
          required
          className="stdform-item"
        />

        <input
          type="text"
          placeholder="Phone Number"
          defaultValue={data.phone}
          id="phone"
          onChange={handleChange}
          required
          className="stdform-item"
        />
        <Modal
          modalId={"datePickerModal"}
          title='Pick joining date'
          cancelOnly
          body={
            <div style={{ display: "flex", flexFlow: "column nowrap"}}>
              <Calendar
                onChange={(item) => setData({ ...data, joiningDate: item })}
                date={data.joiningDate}
              />
            </div>
          }
        />
        <button
          type="button"
          className="btn btn-light fw-bolder stdform-item"
          data-bs-toggle="modal"
          data-bs-target="#datePickerModal"
        >
          Select joining date
        </button>
        <input
          type="text"
          placeholder={
            state
              ? "Enter New Password. Leave empty for previous password"
              : "Password"
          }
          className="form-control stdform-item"
          autoComplete="no"
          id="password"
          onChange={handleChange}
          required={state ? false : true}
        />
        <textarea
          name="address"
          defaultValue={data.address}
          id="address"
          onChange={handleChange}
          rows="5"
          placeholder="Residential address"
          className="w-100 rounded mx-4 stdform-item address-textarea"
          required
        ></textarea>
        <div className="d-flex flex-wrap justify-content-around w-100 alig-items-center">
          <button
            type="button"
            className="btn btn-secondary stdform-item bi bi-x-lg"
            onClick={() => navigate(-1)}
          > Go back
          </button>
          <button className="btn btn-success stdform-item" type="submit">
            <i className={state?'bi bi-arrow-clockwise':'bi bi-plus-lg'}> </i>
            {state ? "Confirm & Update" : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
