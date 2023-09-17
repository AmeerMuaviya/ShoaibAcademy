import moment from 'moment'
import React,{useContext, useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import axios from '../axiosInstance'
import {AuthContext} from '../contexts/authContext'
import { generalContext } from '../contexts/generalContext'
const Notifications = () => {
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
}
    let location=useLocation();
    const {user}=useContext(AuthContext)
    const {setNCounts}=useContext(generalContext)
    const [notifications, setNotifications] = useState()
   function getNotifications(str){
    axios.get(`/notifications/${str}/${user.uid}`).then((response) => {
        setNotifications(response.data.notifications)
            let ids=response.data.notifications.map(value=>value.id)
            if(ids.length>=1)markviewed(ids)
            setNCounts(0)
        })
   }
   function markviewed(ids){
    axios.post('/notifications/markViewed',{ids,uid:user.uid}).then((response) => {
    })
   }
   useEffect(() => {
   getNotifications('getAllNotifications')
    //eslint-disable-next-line
   }, [])
   
  return (
    <div>
        <div>
          <h1 className="page-heading">All Notifications</h1>
            {notifications && !notifications.length && <h1 className='text-center text-secondary'>Nothing to show</h1>}
            {notifications &&
          notifications.map((value, index) => (
            <div key={index} className={`card special-card shadow-lg mx-auto text-center ${JSON.parse(value.views).includes(user.uid)?"":'border-primary'}`}>
            
              <div className="card-header">{value.Auther}</div>
              <div className="card-body">
                <h3 className="card-title">{value.title}</h3>
                <p className="card-text">{value.content}</p>
                {location.pathname!==value.link && <Link type='button' to={value.link} className="btn btn-info" scroll={el => scrollWithOffset(el)}>View</Link>}
              </div>
              <div className="card-footer text-muted">
                {moment(new Date(value.datetime), "YYYYMMDDHHmm").fromNow()}
              </div>
            </div>
          ))}</div>
    </div>
  )
}

export default Notifications