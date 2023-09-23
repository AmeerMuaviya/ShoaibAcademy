import React, { useEffect, useState, useContext } from "react";
import DataTable from "../DataTable";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
const PayFee = () => {
  const { showAlert } = useContext(generalContext);
  const [inputs, setInputs] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  function handleChagne(e) {
    function toMySqlDate(date) {
      return date.toISOString().slice(0, 19).replace("T", " ");
    }
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
      submitting_date: toMySqlDate(new Date()),
      ids: selectedStudents,
    });
  }
  useEffect(() => {
    getAllStudents();
  }, []);
  useEffect(() => {
    setInputs({ ...inputs, ids: selectedStudents });
    //eslint-disable-next-line
  }, [selectedStudents]);

  function getAllStudents() {
    axios.get("/students/all").then((response) => {
      setStudents(response.data);
    });
  }
  function payfee(e) {
    e.preventDefault();
    if (!selectedStudents.length)
      return showAlert("warning", "Select at least one student");
    axios.post("/students/payfee", inputs).then((response) => {
      response.data.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
    });
  }
  return (
    <div className="container my-4">
      <h1 className="page-heading">Add a new record</h1>
      <input
        type="month"
        name="month"
        className="stdform-item mx-auto d-block"
        onChange={handleChagne}
        required
      />
      {students && (
        <DataTable
          arrayOfObjects={students}
          selectedStudents={selectedStudents}
          onChange={setSelectedStudents}
          keysToDisplay={["username","fatherName", "class", "gender"]}
        />
      )}
      <button
      type="submit"
        className="btn btn-primary block-btn stdform-item"
        onClick={payfee}
      >
        Add Record
      </button>
    </div>
  );
};

export default PayFee;
