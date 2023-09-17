import React, { useState, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "../axiosInstance";
import DataTable from "./DataTable";
import { useContext } from "react";
import { generalContext } from "../contexts/generalContext";

const Notifications = (props) => {
  const [inputs, setInputs] = useState({});
  let { user } = useContext(AuthContext);
  let { showAlert } = useContext(generalContext);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState();

  useEffect(() => {
    axios.get(`/${props.notify.toLowerCase()}/all`).then((response) => {
      setStudents(response.data);
    });

  }, [props.notify]);
  function handleSubmit(e) {
    e.preventDefault();
    let data = {
      title: inputs.title,
      content: inputs.content,
      Auther: user.fullName,
      users: JSON.stringify(selectedStudents),
      views: JSON.stringify([]),
      db: props.notify,
      link:`/${props.notify.slice(0,-1)}/notifications`
    };
    axios.post(`/notifications/addNotification`, data).then((response) => {
      if (response.data.err) return showAlert("warning", response.data.msg);
      showAlert("success", response.data.msg);
    });
  }

  function handleInputsChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  return (
      <div className="container mx-auto">
        <h1 className="page-heading">Notify {props.notify}</h1>
      {students && (
          <DataTable
            heading={'All '+props.notify}
            arrayOfObjects={students}
            selectedStudents={selectedStudents}
            onChange={setSelectedStudents}
            keysToDisplay={props.notify==='Students'?["username", "class", "gender"]:["username","email", "gender"]}
          />
        )}
        <form onSubmit={handleSubmit} className='my-3 special-form  mx-auto'>
          <input
            type="text"
            name="title"
            required
            className="w-100 stdform-item"
            placeholder="Enter Title"
            onChange={handleInputsChange}
          />
          <textarea
            name="content"
            required
            className="w-100 stdform-item"
            placeholder="Enter description"
            onChange={handleInputsChange}
          ></textarea>
          <button className="btn btn-primary" disabled={!selectedStudents.length} type="submit">
          <i className="bi bi-plus-lg"> </i>
            Add announcement</button>
        </form>

        
      
      </div>
  );
};

export default Notifications;
