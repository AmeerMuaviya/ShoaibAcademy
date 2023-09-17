import React,{useEffect,useState} from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../../axiosInstance'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { generalContext } from '../../contexts/generalContext'
import { AuthContext } from '../../contexts/authContext'
const AddMarks = () => {
  const {state}=useLocation()
  let navigate=useNavigate()
  let {showAlert,capitallizeFirstLetter}=useContext(generalContext)
  let {user}=useContext(AuthContext)
  const [students, setStudents] = useState([])
  const [scheduleInfo, setScheduleInfo] = useState()
  const [totalMarks,setTotalMarks]=useState()
  const [studentData, setStudentData] = useState([])
  const [scheduleData, setScheduleData] = useState()
    useEffect(() => {
    axios.get(`/schedules/getStudentsOfSchedule/${state.sid}`).then((response) => {
      if(!response.err){
        let data=response.data.students;
        data=data.filter((value) => JSON.parse(value.subjects).includes(state.subject))
        setStudents(data)
        let stData=[]
        data.forEach((value) => {
         stData.push( { name:value.fullName, uid:value.uid, totalMarks:'', obtainedMarks:'',subject:state.subject })
        })
        setStudentData(stData)
    }
    })
    axios.get(`/schedules/getScheduleById/${state.sid}`).then((response) => {
      if(!response.err && response.data){
        setScheduleInfo(response.data.schedules[0])
        setScheduleData(JSON.parse(response.data.schedules[0].data).filter(value => value.date===state.date)[0])
      }
    })
    }, [state])


    function addStudentData(name,uid,totalMarks,obtainedMarks) {
      const student = { name, uid, totalMarks, obtainedMarks,subject:state.subject,date:scheduleData.date,syllabus:scheduleData.subject[state.subject] };
      let studentExists = false;
      studentData.forEach((data, index) => {
        if (data.uid === uid) {
          studentExists = true;
          setStudentData(prevData => {
            prevData[index] = student;
            return [...prevData];
          });
        }
      });
    
      if (!studentExists) {
        setStudentData(prevData => [...prevData, student]);
      }
    }
   
    function updateSchedule(e){
      e.preventDefault()
      let data=JSON.parse(scheduleInfo.data)
      data.forEach((value) =>{ 
        if(value.date===state.date){
          value.result={...value.result,[state.subject]:studentData}
          value.isChecked=true
        }
      })
      axios.post(`/schedules/addResult/${state.sid}`,{data}).then((response) => {
        if(!response.err){
          let dataForNotification={
            Auther:'Using default system',
            title:'Test Checked',
            content:`Your test conducted on ${data[0].date}(${data[0].day}) has been checked. Check out your marks`,
            db:'Students',
            users:scheduleInfo.students,
            link:`/Student/schedules#${scheduleInfo.sid}`
        }
            axios.post('/notifications/addNotification',dataForNotification).then((res) => {
              showAlert('success',response.data.msg)
              navigate(`/${capitallizeFirstLetter(user.status)}/all-schedules`)
            })
        }
        else showAlert('warning',response.data.err)
      })
    }
    function getSubject(all_subjects,subject){
      all_subjects=JSON.parse(all_subjects)
      subject=Object.keys(subject)
      return subject.filter((value) => all_subjects.includes(value))
    }
  return (
    <div className='container my-3'>
        <h1>Schedule data</h1>
      {scheduleInfo && scheduleData && <div className="infoDiv shadow-lg p-1 d-flex justify-content-around flex-wrap">
        <div className="text-center">
          <h2>Class Name: <span className="text-primary">{scheduleInfo.className}</span></h2>
          <h2>Teacher Name: <span className="text-primary">{scheduleInfo.teacherName}</span></h2>
          <h2>Test Type: <span className="text-primary">{scheduleInfo.testType}</span></h2>
        </div>
        <div className="text-center">
          <h2>Conducting date: <span className="text-primary">{scheduleData.date}</span></h2>
          <h2>Conducting day: <span className="text-primary">{scheduleData.day}</span></h2>
          <h2>Subject(s): <span className="text-primary">{state.subject==='all'?Object.keys(scheduleInfo.subject).join('-'):state.subject}</span></h2>
        </div>
        <input type="number" className='w-25' name="" id="" placeholder='Enter Total Marks' onChange={e=>setTotalMarks(e.target.value)}/>
      </div>}
      <table className='table border my-3 table-success'>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Total Marks</th>
            <th>Obtained Makrs</th>
          </tr>
        </thead>
        <tbody>
          {students && students.map((student,index) => (
          <tr key={index}>
            <td>{student.username}</td>
            {scheduleData && <td>{state.subject}</td>}
            <td>{totalMarks}</td>
            <td><input type="number" name="obtained-marks" onChange={e=>addStudentData(student.fullName,student.uid,totalMarks,e.target.value,getSubject(student.subjects,scheduleData.subject))}/></td>
          </tr>            
          ))}
        </tbody>
      </table>
      {!students.length && <h1 className='text-center text-secondary'>Nothing to show</h1>}
      <button className="btn btn-primary" onClick={updateSchedule}>Add Marks</button>
    </div>
  )
}

export default AddMarks
