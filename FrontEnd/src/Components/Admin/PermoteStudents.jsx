import React,{useState,useEffect} from "react";
import { useContext } from "react";
import axios from '../../axiosInstance'
import { generalContext } from "../../contexts/generalContext";
import DataTable from '../DataTable'
const PermoteStudents = () => {
    const {classes,showAlert}=useContext(generalContext)
    let _classes=classes.map((value) => value.className)
    const [students, setStudents] = useState([])
    const [cn, setClassName] = useState()
    const [selectedStudents, setSelectedStudents] = useState([])
    function getStudents(){
      axios.get('/students/all').then((response) => {
        if(!response.data.err) setStudents(response.data)
      })
    }
    useEffect(() => {
      getStudents();
    }, [])
    function handleSubmit(){
      if(!selectedStudents.length) showAlert('warning','No students selected')
      else if(cn==='' || !cn) showAlert('warning','Class not selected')
      else{
      axios.put('/students/permoteStudentsByList',{className:cn,students:selectedStudents}).then((response) => {
        let type=response.data.err?'warning':'success'
        showAlert(type,response.data.msg)
        getStudents();
      })
    }
  }
  return (
    <div className="container my-4">
        <h1 className="page-heading">Permote Students</h1>
      <select
      onChange={(e)=>setClassName(e.target.value)}
        className="form-select form-select mb-3 fs-5 stdform-item w-100 mx-auto"
        aria-label=".form-select example"
      >
        <option >Select Class</option>
        {_classes.map((value, index) =><option key={index}>{value}</option>)}
      </select>
      {students && (
          <DataTable
            arrayOfObjects={students}
            selectedStudents={selectedStudents}
            onChange={setSelectedStudents}
            keysToDisplay={["username", "class", "gender"]}
          />
        )}
        <button className="btn btn-primary block-btn my-4" type="submit" onClick={handleSubmit}>Update Records</button>
    </div>
  );
};

export default PermoteStudents;
