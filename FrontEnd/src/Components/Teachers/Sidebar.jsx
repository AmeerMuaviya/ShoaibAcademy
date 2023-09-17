import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/authContext'
import { generalContext } from '../../contexts/generalContext'
import "../Css/Teacher.css"
import axios from '../../axiosInstance'
const TeacherHome = () => {
  const {logout,user}=useContext(AuthContext)
  const {nCounts,setNCounts,url}=useContext(generalContext)
  const [sidebar, setSidebar] = useState(false)
  let toggleSidebar = () => setSidebar(!sidebar)
  let navigate=useNavigate()
  const handleLogout=(e)=>{
    e.preventDefault()
    logout()
    navigate('/')
  }
  useEffect(() => {
    axios.get(`/notifications/getNotificatoinsCount/${user.uid}`).then((response) => {
      setNCounts(response.data.count)
    })
    //eslint-disable-next-line
  }, [user.uid])
  

  useEffect(() => {
    let listener=()=>{
      setSidebar(false)
    }
    let element=document.getElementsByClassName('sidebarElem')
    Array.from(element).forEach((elem) => {
      elem.addEventListener('click',listener)
    })
    
    return () => {
      Array.from(element).forEach((elem) => {
        elem.removeEventListener('click',listener)
        })
    }
  }, [sidebar])
  
  return (
    <>
      <nav className="navbar sticky-top bg-light px-2 shadow-lg d-flex flex-wrap">
        <div onClick={toggleSidebar} className="hamburger"><h2><i className="bi bi-list"></i></h2></div>
        <div>
          <Link className="navbar-brand title" to="/Teacher">Shoaib Academy</Link>
        </div>
        <div className='d-flex justify-content-center align-items-center flex-wrap gap-4'>
        <Link to='/Teacher/notifications' type="button" className="">
        <span className="bi bi-bell-fill special-icon fs-3 position-relative">
 {nCounts>=1 && <p className="position-absolute badge m-0 bg-danger d-flex justify-content-center align-items-center" style={{fontSize:'15px',padding:'4px',width:'25px',height:'25px',borderRadius:'100%',textAlign:'center',verticalAlign:'center',top:'-13%',left:'38%'}}>{nCounts}
  </p>}
        </span>
    
    <span className="visually-hidden">unread messages</span>
</Link>
<Link to='about-me'>
<img title='Profile picture' src={parseInt(user.dp) ? `${url}/getfile/${user.dp}` : user.gender === 'Male' ? `/images/profile-boy.webp` : '/images/profile-girl.jpg'} alt="" style={{ borderRadius: '100%', width: '50px', height: '50px' }} />
</Link>
        </div>

      </nav>
      <div id='Sidebar' className={sidebar ? 'showSidebar' : 'hideSidebar'}>
        <div className="header d-flex justify-content-between align-items-center flex-wrap">
          <h2 className='d-inline'><button type='button' onClick={toggleSidebar} className="hide bi bi-list "></button></h2>
          <h4 className='d-inline fw-bolder small-title mx-2'>{user.fullName}</h4>
        </div>
        <hr />
        <ul className='p-0'>
          <Link to='' className='li sidebarElem'><i className="bi bi-house-door-fill"></i>Home</Link>
         

          <div className="li d-flex align-items-center">
          <i className="bi bi-calendar-range"></i>
          <li className="nav-item dropdown">
          <div className=" dropdown-toggle fw-bold" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Manage Schedules
          </div>
          <ul className="dropdown-menu">
            <li> 
              <Link to='add-schedule' className='dropdown-item sidebarElem'>Add Schedule</Link>
            </li>
            <li><Link className="dropdown-item sidebarElem" to="/Teacher/all-schedules">All Schedules</Link></li>
            <li><Link className="dropdown-item sidebarElem" to='/Teacher/trashed-schedules'>Trashed Schedules</Link></li>
          </ul>
        </li>
          </div>
        

          <Link to='notifications' className='li sidebarElem'><i className="bi bi-app-indicator"></i>Notifications
          {nCounts>=1 && <span className='bg-danger badge mx-2'>{nCounts}</span>}</Link>
          <Link to='notes' className='li sidebarElem'><i className="bi bi-stickies-fill"></i>Upload Notes</Link>
          <Link to='change-password' className='li sidebarElem'><i className="bi bi-shield-lock-fill"></i>Change Password</Link>
          <Link to='notify-admin' className='li sidebarElem'><i className="bi bi-stickies-fill"></i>Notify Admin</Link>
          <Link to='about-me' state={{uid:user.uid}} className='li sidebarElem'><i className="bi bi-person-bounding-box"></i>About me</Link>
          <span onClick={handleLogout} className='li sidebarElem'><i className="bi bi-box-arrow-left"></i>Logout</span>
        </ul>
      </div>
      <Outlet />
    </>
  )
}

export default TeacherHome