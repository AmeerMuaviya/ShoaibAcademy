import React,{useState,useEffect} from 'react'
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar'
import { Link } from 'react-router-dom'
import axios from '../../../axiosInstance'
const OtherInfo = () => {
  const [schedulePercentage, setSchedulePercentage] = useState(0)
  const [fee, setFee] = useState(0)
  const [notification, setNotification] = useState(0)
  useEffect(() => {
    axios.get('/schedules/schedulesInfo').then((response) => {
     if(!response.err) setSchedulePercentage(parseInt(response.data))
    })
    axios.get('/students/getFeeInfo').then((response) => {
      if(response.data.err)return
      setFee(parseInt(response.data))
    })
    axios.get('/notifyAdmin/getInfo').then((response) => {
      if(response.data.err)return
      setNotification(parseInt(response.data))
    })
  }, [])
  function getColor(number){
    if(number >20 && number<40) return 'purple'
    else if(number>40 && number <70) return 'yellow'
    else if(number>70 && number <90) return 'brown'
    else if(number>90) return 'red'
    return 'green'

  }
  return (
    <div>
    <h1 className="dashboard-title m-5">Other pending tasks info</h1>
    <div className="all-info-cards">
    {!fee && !schedulePercentage && !notification ?<h2 className='text-secondary text-center'>Nothing to display!</h2>:null}
      {schedulePercentage?<div className="info-card shadow-lg card-1">
        <div className="circular-progress-bar">
          <CircularProgressbar strokeWidth={7} styles={buildStyles({
                textColor: "black",
                pathColor: getColor(schedulePercentage),
                trailColor: "lightgrey",
              })} value={schedulePercentage} text={schedulePercentage+'%'} />
        </div>
        <Link to='/Admin/all-schedules'className="fs-5 info-card-des btn btn-primary border-none">UnChecked Test <i className="bi bi-arrow-up-right"></i></Link>  
      </div>:null}

      {fee ?<div className="info-card shadow-lg card-2">
        <div className="circular-progress-bar">
          <CircularProgressbar strokeWidth={7} styles={buildStyles({
                textColor: "black",
                pathColor: getColor(fee),
                trailColor: "lightgrey",
              })} value={fee} text={fee+'%'} />
        </div>
        <Link to='/Admin/unpaid-fee-records'className="fs-5 info-card-des btn btn-primary border-none">Unpaid Fee<i className="bi bi-arrow-up-right"></i></Link> 
      </div>:null}


      {notification?<div className="info-card shadow-lg card-3">
        <div className="circular-progress-bar">
          <CircularProgressbar strokeWidth={7} styles={buildStyles({
                textColor: "black",
                pathColor: getColor(notification),
                trailColor: "lightgrey",
              })} value={notification} text={notification+'%'} />
        </div>
        <Link to='/Admin/notifications-for-me'className="fs-5 info-card-des btn btn-primary border-none">Unseen Notifications <i className="bi bi-arrow-up-right"></i></Link>  
      </div>:null}

    </div>
  


    </div>
  )
}

export default OtherInfo