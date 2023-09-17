import axios from "../../axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import DataTable from '../../Components/DataTable'
import { generalContext } from "../../contexts/generalContext";
import { useNavigate } from "react-router-dom";
const PrintCards = () => {
    const navigate=useNavigate()
  const {showAlert}=useContext(generalContext)
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([])
  console.log(selectedStudents)
  function getStudents() {
    axios.get("/students/all").then((response) => {
      if (!response.data.err) setStudents(response.data);
    });
  }
  useEffect(() => {
    getStudents();
  }, []);
  const handleSubmit=()=>{
    if(!selectedStudents.length){
       return showAlert('warning','Select at least one student')
    }
    navigate('/Admin/print-student-cards/',{state:selectedStudents})
  }
  return (
    <>
      <div className="container my-4">
        <h1 className="page-heading">Print Student Cards</h1>
        {students && (
          <DataTable
            arrayOfObjects={students}
            selectedStudents={selectedStudents}
            onChange={setSelectedStudents}
            keysToDisplay={["username", "class", "gender"]}
          />
        )}
        <button
          className="btn btn-primary block-btn my-4"
          type="submit"
          onClick={handleSubmit}
        >
          Get cards
        </button>
      </div>
    </>
  );
};

export default PrintCards;
