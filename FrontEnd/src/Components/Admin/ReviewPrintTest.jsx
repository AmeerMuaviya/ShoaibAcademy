import React, { useEffect, useState,useContext } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import DataTable from "../DataTable";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
const ReviewPrintTest = () => {
  const [students, setStudents] = useState([]);
  const navigate=useNavigate();
  const {showAlert}=useContext(generalContext)
  const [selectedStudents, setSelectedStudents] = useState([]);
  let {sid,className,testType,idate,fdate,data} = useLocation().state;
  const [inputs, setInputs] = useState({className,testType,sid,fdate,idate,isCollective:0});
  useEffect(() => {
    axios.get(`/schedules/getStudentsOfSchedule/${sid}`).then((response) => {
        setStudents(response.data.students)
    })
  }, [sid]);

  function handleChange(e){
    setInputs({...inputs,[e.target.name]:e.target.value})
  }
  
  function handleSubmit(){
    let checkedTests=JSON.parse(data).filter((value) => value.isChecked===true)
    if(!checkedTests.length) 
    showAlert('warning','No checked tests found. Please ensure to carefully add the test marks.')
    else if(inputs.isCollective==='')
        showAlert('warning','Please select marking type.')
    else if(!selectedStudents.length)
        showAlert('warning','Select at least one student.')
    else navigate('/Admin/view-result-cards',{state:{ selectedStudents, inputs }})
  }
  return (
    <div className="container my-3">
      <DataTable
        heading="Select Students"
        arrayOfObjects={students}
        selectedStudents={selectedStudents}
        onChange={setSelectedStudents}
        keysToDisplay={["username", "class", "gender"]}
      />
        <select name="isCollective" className="stdform-item d-block my-2" onChange={handleChange} defaultValue={0}>
            <option value="">Print Tests</option>
            <option value={0}>Individually marked</option>
            <option value={1}>Collectively marked</option>
        </select>
        <button className="btn btn-primary block-btn" onClick={handleSubmit}>Get Result now</button>
    </div>
  );
};

export default ReviewPrintTest;
