import moment from 'moment'
import React,{useState,useEffect} from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axiosInstance'
import { generalContext } from '../../contexts/generalContext'
const NotificationsForMe = () => {
    const {setNCounts}=useContext(generalContext)
    const [notifications, setNotifications] = useState()
    const [teachers, setTeachers] = useState()
    function getNotifications(){
        axios.get('/notifyAdmin/get/all').then((response) => {
            if(!response.data.err){
            setNotifications(response.data.notifications)
            markAll()
            setNCounts(0)
        }
        })
    }
    function markAll(){
        axios.post('/notifyAdmin/mark/all')
    }
    function getAllTeachers(){
        axios.get('/teachers/all').then((response) => {
            setTeachers(response.data)
        })
    }
    useEffect(()=>{
        getNotifications();
        getAllTeachers();
        //eslint-disable-next-line
    },[])
    function getTeacher(uid){
        if(!teachers.length) return 'not Found'
        let _teacher=teachers.filter((value) => value.uid===uid)
        if(_teacher.length) return _teacher[0].fullName
        else return 'Not Found'
    }
  return (
    <div className='container my-5'>
        <h1>Message From Teachers</h1>
       {teachers && notifications && notifications.map((value,index) => 
       (<div key={index} className={value.status==='Unseen'?"card border-primary special-card mx-auto":'card special-card mx-auto'}>
        <Link to='/Admin/view-user' state={{uid:value.uid}}>
  <h5 className="card-header">Sent By <span className="text-decoration-underline">
   {getTeacher(value.uid)} </span> 
    </h5>
        </Link>
  <div className="card-body">
    <p className="card-text">{value.content}</p>
  </div>
    <div className="card-footer text-muted">
   Sent {moment(new Date(value.datetime), "YYYYMMDDHHmm").fromNow()}
  </div>
</div>
       ))}
       {notifications && !notifications.length && <h2 style={{color:"gray"}} className='text-center text-secondary' >Nothing to display!</h2>}
    </div>
  )
}

export default NotificationsForMe