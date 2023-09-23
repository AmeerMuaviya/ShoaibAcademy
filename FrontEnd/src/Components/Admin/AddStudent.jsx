import React, { useState, useContext, useEffect } from "react";
import axios from "../../axiosInstance";
import { useLocation } from "react-router-dom";
import { generalContext } from "../../contexts/generalContext";
import useFetchSubjects from "../useFetchSubjects";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-date-range";
import moment from 'moment'
const AddStudent = () => {
  let navigate=useNavigate();
  let defaultSubjects=useFetchSubjects();
  const state = useLocation().state;
  const [data, setData] = useState({
    username: state?.username || "",
    fullName: state?.fullName || "",
    fatherName: state?.fatherName || "",
    email: state?.email || "",
    gender: state?.gender || "",
    phoneNumber: state?.phoneNumber || "",
    class: state?.class || "",
    fee: state?.fee || "",
    address: state?.address || "",
    age: state?.age || "",
    joiningDate: state?(new Date(state.joiningDate)): new Date(),
    dateOfBirth: state?(new Date(state.dateOfBirth)): new Date(),
    dp: state?.dp || "",
    status: "Student",
    password: "",
    feeStatus: state?.feeStatus || "Unpaid",
    subjects: state?JSON.parse(state.subjects):[],
    isActive: true,
  });
  const { showAlert, classes, url } = useContext(generalContext);
  const [_url, setUrl] = useState("");

  const handlePicChanged = (e) => {
    const file = e.target.files[0];
    setUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if(data.class!==''){
    let _class=classes.filter((value) => value.className===data.class)
    if(_class.length){
      setData({...data,subjects:JSON.parse(_class[0].subjects)})
    }
  }
  //eslint-disable-next-line
  }, [data.class])
  

  const UploadData = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("dp", data.dp);
    let image = await axios.post("/user/uploadDp", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    let allData = { ...data,subjects:JSON.stringify(data.subjects)};
    if (data.dp !== state?.dp) {
      allData["dp"] = image.data ? image.data : false;
    }
    try {
      const res2 = state
        ? await axios.put(`/students/updateStudent/${state.uid}`, allData)
        : await axios.post(`/students/addStudent`, allData);
      let responseState = res2.data.err ? "warning" : "success";
      showAlert(responseState, res2.data.msg.toString());
      if(!res2.data.err) navigate('/Admin/all-students')
    } catch (error) {
      showAlert("warning", error.response.data.toString());
    }
    return false; // to prevent page refresh
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
  function changeSbj(value) {
    let _sub=[...data.subjects];
    if (!_sub.includes(value)) {
      _sub.push(value)
    } else {
      let index = _sub.indexOf(value);
      if (index > -1) {
        _sub.splice(index, 1);
      }
    }
    let _data={...data,subjects:[...new Set(_sub)]}
    setData(_data);
  }

  return (
    <div className="container std-container ">
      <Modal
        title="Select Subjects"
        modalId="subjects"
        body={<div className='d-flex align-items-center gap-2 flex-wrap'>{defaultSubjects.map((value,index) => (
          <div key={index}>
          <button onClick={()=>changeSbj(value)} className={data.subjects.includes(value)?'sbj-btn selected-sbj':'sbj-btn unselected-sbj'}>{value} {data.subjects.includes(value)? <i className='bi bi-x-lg'></i>: <i className='bi bi-plus-lg'></i>}</button>
          
          </div>
          ))}</div>}
      />
      <form
        onSubmit={UploadData}
        className="d-flex justify-content-between stdform flex-wrap mx-auto"
      >
        <h1 className="fw-bolder my-3 page-heading text-center w-100 text-white">
          Enter Following details of the student.
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
          onChange={(e) => {
            setUrl(e.target.value);
            handlePicChanged(e);
            handleChange(e);
          }}
          id="dp"
          className="d-none "
          accept=".jpg,.png,.jpeg"
        />
        <input
          defaultValue={data.username}
          type="text"
          id="username"
          className="form-control stdform-item"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          defaultValue={data.fullName}
          type="text"
          placeholder="Full name"
          className="stdform-item"
          id="fullName"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="stdform-item"
          defaultValue={data.fatherName}
          placeholder="Father name"
          id="fatherName"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          className="stdform-item"
          defaultValue={data.age}
          placeholder="Student age"
          id="age"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="stdform-item"
          defaultValue={data.email}
          placeholder="Email address"
          id="email"
          onChange={handleChange}
        />

        <select
          name=""
          className="stdform-item"
          defaultValue={data.gender}
          id="gender"
          required
          onChange={handleChange}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select
          required
          defaultValue={data.class}
          id="class"
          className="stdform-item"
          onChange={(e) => handleChange(e)}
        >
          <option value="">Select Class</option>
          {classes.map((value, index) => {
            return (
              <option key={index}>
                {value.className}
              </option>
            );
          })}
        </select>

        <input
          type="number"
          className="stdform-item"
          defaultValue={data.fee}
          placeholder="Fee"
          id="fee"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="stdform-item"
          placeholder="Student Phone Number (opt)"
          defaultValue={data.studentPhoneNumber}
          id="studentPhoneNumber"
          onChange={handleChange}
        />
        <input
          type="text"
          className="stdform-item"
          placeholder="Guardian Phone Number (opt)"
          defaultValue={data.guardianPhoneNumber}
          id="guardianPhoneNumber"
          onChange={handleChange}
        />
        <input
          type="text"
          className="stdform-item"
          placeholder="Phone Number"
          defaultValue={data.phoneNumber}
          id="phoneNumber"
          onChange={handleChange}
          required
        />
        <Modal
          modalId={"dob"}
          title='Pick Date of birth'
          cancelOnly
          body={
            <div style={{ display: "flex", flexFlow: "column nowrap"}}>
              <Calendar
                onChange={(item) => setData({ ...data, dateOfBirth: item })}
                date={data.dateOfBirth}
              />
            </div>
          }
        />
        <button
          type="button"
          className="btn btn-light fw-bolder stdform-item"
          data-bs-toggle="modal"
          data-bs-target="#dob"
        >
          Date of Birth ({moment(data.dateOfBirth).format("DD MMM, YYYY")})
        </button>
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
          Joining date ({moment(data.joiningDate).format("DD MMM, YYYY")})
        </button>
        <input
          type="text"
          defaultValue={data.password}
          placeholder="Password"
          className="form-control stdform-item"
          autoComplete="no"
          id="password"
          onChange={handleChange}
          required={!state && true}
        />
        <button
          type="button"
          className="btn btn-light mt-2 fw-bolder stdform-item"
          data-bs-toggle="modal"
          data-bs-target="#subjects"
        >
          Select Subjects
        </button>
        <textarea
          name="address"
          defaultValue={data.address}
          id="address"
          onChange={handleChange}
          rows="5"
          placeholder="Residential address"
          className=" stdform-item address-textarea"
          required
        ></textarea>
        <div className="w-100 d-flex flex-wrap justify-content-around alig-items-center">
        <button className="btn btn-secondary stdform-item bi bi-x-lg" onClick={()=>navigate(-1) } type='button'> Go back</button>
        <button
          className="btn btn-success text-center stdform-item"
          type="submit"
          >
          <i className={state?"bi bi-arrow-clockwise":"bi bi-plus-lg"}> </i>
          {state ? " Confirm & Update" : " Add Now"}
        </button>
          </div>
      </form>
    </div>
  );
};

export default AddStudent;
