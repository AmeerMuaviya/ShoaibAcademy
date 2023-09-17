import React from 'react'
import '../Css/Teacher.css'
import ReactToExcel from 'react-html-table-to-excel'
import { useState } from 'react'
const MarkSheet = (props) => {
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  // eslint-disable-next-line
  const [finalObj, setFinalObj] = useState([])
  let Data={
    teacher:props.teacher,
    class:props.grade,
    test_type:props.type,
    subject:props.subject,
    test_category:props.category,
    date:props.date,
    total_marks:props.totalMarks,
  }
  function getSortedObj(){
    //* TODO set finalobj in the database
    // eslint-disable-next-line
    let finalObj=[{...Data,students:{...students}}]
    // return finalObj;
  }
  let handleInputChange=(e)=>{
    marks[e.target.id]=e.target.value
    setMarks(marks)
    let student=[]
    props.sts.forEach((value,index) => {
      student.push({name:value,marks:marks[index]===undefined||marks[index]===null?'':marks[index]})
    })
    setStudents(student)

}
// html starts here
  return (
    <div className='container mx-auto my-5 p-4'>
     
     <button type="button" className="btn btn-primary my-3" onClick={getSortedObj} data-bs-toggle="modal" data-bs-target="#exampleModal">
  Preview
</button>
     <table className="table" >
  <thead>
    <tr>
    <th>Teacher</th>
    <th>Class</th>
    <th>Subject</th>
    <th>Test Type</th>
    <th>Date</th>
    <th>Category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sir Ali</td>
      {/*TODO Get info about Teacher from auth-token */}
      <td>{props.grade}</td>
      <td>{props.subject}</td>
      <td>{props.type}</td>
      <td>{props.date}</td>
      <td>{props.category}</td>
    </tr>
      
    <tr>
      <td colSpan="6">
        <table className="table table-success my-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Obtained Marks</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
            {props.sts.map((val, index) => {
              return (
                <tr key={index}>
                <td>{val}</td>
                <td><input type="number" name={val} id={index} className='w-100' onChange={handleInputChange}/></td>
                <td>{props.TotalMarks}</td>
          </tr>
              )
            })}
        </tbody>
        </table>
      </td>
    </tr>
    <tr>
    </tr>
  </tbody>
</table>




{/* <!-- Button trigger modal --> */}


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Final Result</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <table className="table" id='mytb'>
  <thead>
    <tr>
    <th>Teacher</th>
    <th>Class</th>
    <th>Subject</th>
    <th>Test Type</th>
    <th>Date</th>
    <th>Category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sir Ali</td>
      {/*TODO Get info about Teacher from auth-token */}
      <td>{props.grade}</td>
      <td>{props.subject}</td>
      <td>{props.type}</td>
      <td>{props.date}</td>
      <td>{props.category}</td>
    </tr>
      
    <tr>
      <td colSpan="6">
        <table className="table table-success my-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Obtained Marks</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
            {props.sts.map((val, index) => {
              return (
                <tr key={index}>
                <td>{val}</td>
                <td>{marks[index]}</td>
                <td>{props.TotalMarks}</td>
          </tr>
              )
            })}
        </tbody>
        </table>
      </td>
    </tr>
    <tr>
    </tr>
  </tbody>
</table>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <ReactToExcel table='mytb' className='btn btn-success ' filename='Result' sheet='1' buttonText='Download'/>
        <button className="btn btn-primary" onClick={getSortedObj}>Just Upload</button>
      </div>
    </div>
  </div>
</div>

</div>
  )
}

export default MarkSheet