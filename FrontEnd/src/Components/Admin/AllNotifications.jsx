import React,{useState,useEffect, useContext} from 'react'
import moment from "moment";
import { generalContext } from '../../contexts/generalContext';
import Modal from '../Modal';
import axios from '../../axiosInstance'
import { Link, useLocation } from 'react-router-dom';
const AllNotifications = () => {
    let {showAlert,url}=useContext(generalContext)
    let state=useLocation().state
    const [allNotifications, setAllNotifications] = useState();
    const [modalData, setModalData] = useState();
    useEffect(() => {
        fetchNotifications();
        //eslint-disable-next-line
      }, [state]);

    function fetchNotifications() {
        axios.get(state?`/notifications/getAllNotifications/${state.uid}`:"/notifications/all").then((response) => {
          if(response.data.err) return showAlert(response.data.err)
          setAllNotifications(response.data.notifications);
        });
      }
    const prepareData = (users,db) => {
        setModalData("Loading...");
        let list = JSON.parse(users);
        if(!list.length) return setModalData('No data found...')
        axios.post(`/${db.toLowerCase()}/get${db}ByList`, { list }).then((response) => {
          if (!response.err) {
            let result = response.data.map((value, index) => {
              return <div key={index} className='d-flex justify-content-between align-items-center border p-2 mb-1'>
                <img src={parseInt(value.dp) ? `${url}/getfile/${value.dp}` : value.gender === 'Male' ? `/images/profile-boy.webp` : '/images/profile-girl.jpg'} alt="" style={{ borderRadius: '100%', width: '55px', height: '55px' }} />
                <Link to='/Admin/view-user' state={{uid:value.uid}}><h4 className='m-0'  data-bs-dismiss="modal">{value.fullName}</h4></Link>
                <span className='fs-6'>{value.class}</span>
                </div>;
            });
            setModalData(result);
            return
          }
        });
        setModalData("Some Error accured while fetching data :(");
      };
      function deleteNotification(id){
        axios.delete(`/notifications/deleteNotification/${id}`).then((response) => {
          let state=response.data.err?'warning':'success'
          showAlert(state,response.data.msg)
          fetchNotifications();
        })
      }
  return (
    <div className='container'>
      <Modal modalId={"Users"} body={modalData} cancelOnly title='Users who will get this notification.' />

          <h1 className="mt-4 page-heading">All Notifications</h1>
          {allNotifications && !allNotifications.length && <h2 className='text-secondary text-center'>Nothing to display!</h2>}
        {allNotifications &&
          allNotifications.map((value, index) => (
            <div key={index} className="card text-center p-0 special-card mx-auto">
              <div className="card-header">
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-primary bi bi-people-fill"
                  data-bs-toggle="modal"
                  data-bs-target={"#Users"}
                  onClick={() => prepareData(value.users,value.db)}
                > Users
                </button>
                <button
                  type="button"
                  className="btn btn-primary bi bi-eye"
                  data-bs-toggle="modal"
                  data-bs-target={"#Users"}
                  onClick={() => prepareData(value.views,value.db)}
                > Views
                </button>
                <button className="btn btn-warning bi bi-trash3-fill" onClick={()=>deleteNotification(value.id)}> Delete</button>
              </div>
                {value.Auther}</div>
              <div className="card-body">
                <h3 className="card-title">{value.title}</h3>
                <p className="card-text">{value.content}</p>
              </div>
              <div className="card-footer text-muted">
                {moment(new Date(value.datetime), "YYYYMMDDHHmm").fromNow()}
              </div>
            </div>
          ))}
    </div>
  )
}

export default AllNotifications