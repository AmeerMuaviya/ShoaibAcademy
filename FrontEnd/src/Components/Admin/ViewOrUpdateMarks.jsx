import axios from '../../axiosInstance'
import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { generalContext } from '../../contexts/generalContext'
import { AuthContext } from '../../contexts/authContext'

const ViewOrUpdateMarks = (props) => {
    let navigate=useNavigate()
  let {showAlert,capitallizeFirstLetter}=useContext(generalContext)
  let {user}=useContext(AuthContext)
    const [scheduleData, setScheduleData] = useState()
    const [scheduleInfo, setScheduleInfo] = useState()
    const [result, setResult] = useState()
    const {state}=useLocation()
  useEffect(() => {
    axios.get(`/schedules/getScheduleById/${state.sid}`).then((response) => {
      if(!response.err){
        setScheduleData(response.data.schedules[0])
        setScheduleInfo(JSON.parse(response.data.schedules[0].data).filter(value => value.date===state.date)[0])
        let result=JSON.parse(response.data.schedules[0].data).filter(value => value.date===state.date)[0].result
        if(state.subject==='all')
         result= [].concat(...Object.values(result))
        else 
        result=result[state.subject]
        setResult(result)
      }
    })
    }, [state,props])
    function handleDataChange(e){
        setResult(prevState => prevState.map(item =>
            item.uid === e.target.id
              ? { ...item, [e.target.name]: e.target.value }
              : item
          ))
    }
    function updateSchedule(){
        let data=JSON.parse(scheduleData.data)
      data.forEach((value) =>{ 
        if(value.date===state.date){
          value.result={...value.result,[state.subject]:result}
          value.isChecked=true
        }
      })
      let dataForNotification={
        Auther:'Using default system',
        title:'Test Checked',
        content:`Your result of test conducted on ${data[0].date}(${data[0].day}) has been updated. Check out your marks`,
        db:'Students',
        users:scheduleData.students,
        link:`/Student/schedules#${scheduleInfo.sid}`
    }
        axios.post(`/schedules/addResult/${state.sid}`,{data}).then((response) => {
            if(!response.err){
              axios.post('/notifications/addNotification',dataForNotification).then((res) => {
                showAlert('success',response.data.msg)
                navigate(`/${capitallizeFirstLetter(user.status)}/all-schedules`)
              })
            }
            else showAlert('warning',response.data.err)
          })
    }
  return (
    <div className='container my-3'>
    <h1>Schedule data</h1>
  {scheduleData && scheduleInfo && <div className="infoDiv shadow-lg p-1 d-flex justify-content-around flex-wrap">
    <div className="text-left">
      <h2>Class Name: <span className="text-primary">{scheduleData.className}</span></h2>
      <h2>Teacher Name: <span className="text-primary">{scheduleData.teacherName}</span></h2>
      <h2>Test Type: <span className="text-primary">{scheduleData.testType}</span></h2>
    </div>
    <div className="text-left">
      <h2>Conducting date: <span className="text-primary">{scheduleInfo.date}</span></h2>
      <h2>Conducting day: <span className="text-primary">{scheduleInfo.day}</span></h2>
      <h2>Subject: <span className="text-primary">{state.subject==='all'?Object.keys(scheduleInfo.subject).join('-'):state.subject}</span></h2>
    </div>
  </div>}
  <table className='table border my-3 table-success'>
    <thead>
      <tr>
        <th>Name</th>
        <th>Father name</th>
        <th>Subject</th>
        <th>Syllabus</th>
        <th>Total Marks</th>
        <th>Obtained Makrs</th>
      </tr>
    </thead>
    <tbody>
      {scheduleData && result.map((value,index) => (
      <tr key={index}>
        <td>{value.name}</td>
        <td>{value.fatherName}</td>
        <td>{value.subject}</td>
        <td>{value.syllabus}</td>
        <td>{state.view?<span>{value.totalMarks}</span>:<input type="text"defaultValue={value.totalMarks} name='totalMarks' id={value.uid} onChange={handleDataChange} />}</td>
        <td>{state.view?<span>{value.obtainedMarks}</span>:<input type="number" name="obtainedMarks" id={value.uid} defaultValue={value.obtainedMarks} onChange={handleDataChange} />}</td>
      </tr>            
      ))}
    </tbody>
  </table>
  {!state.view && <button className="btn btn-primary" onClick={updateSchedule}>Update Marks</button>}
</div>
  )
}

export default ViewOrUpdateMarks
