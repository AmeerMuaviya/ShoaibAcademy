import React, { useEffect } from 'react'
import { useContext } from 'react'
import {  useLocation, } from 'react-router-dom'
import '../Css/ViewStd.scss'
import { generalContext } from '../../contexts/generalContext'
import moment from 'moment'
import { useState } from 'react'
const ViewTeacher = () => {
    const data = useLocation().state
    console.log('data: ', data);
    let {capitallizeFirstLetter,url}=useContext(generalContext)
    const [imageURL, setImageURL] = useState('/images/defaultStBg.webp');

    useEffect(() => {
      fetch('https://source.unsplash.com/random/1200x600?books')
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error('Network response was not ok');
        })
        .then(blob => {
          setImageURL(URL.createObjectURL(blob));
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }, []);
  return (
    <>
    <div className='container my-2'>
    <div className='d-flex align-items-center' style={{backgroundImage:`url(${imageURL})`,height:'400px',verticalAlign:'center',backgroundSize:'cover'}}>
      <img src={parseInt(data.dp)?`${url}/getfile/${data.dp}`:data.gender==='Male'?`/images/profile-boy.webp`:'/images/profile-girl.jpg'} className='big-dp' alt="User Profile" />
      </div>
      <h1>~ {capitallizeFirstLetter(data.username)}</h1>
    

    <div className="detailsTable shadow-lg">
      <table className='table mt-5 shadow-lg mb-4'>
        <thead>
          <tr>
            <th>Name</th>
            <th className='data'>{data.username}</th>
          </tr>
          <tr>
            <th>Full Name</th>
            <th>{data.fullName}</th>
          </tr>
          <tr>
            <th>Father Name</th>
            <th>{data.fatherName}</th>
          </tr>
          <tr>
            <th>Date of birth</th>
            <th>{moment((new Date(data.dateOfBirth))).format("MMM DD, YYYY")}</th>
          </tr>
          <tr>
            <th>Gender</th>
            <th>{data.gender}</th>
          </tr>
          <tr>
            <th>Phone Number</th>
            <th>{data.phone}</th>
          </tr>
          <tr>
            <th>Email</th>
            <th>{data.email}</th>
          </tr>
          <tr>
            <th>Qualification</th>
            <th>{data.qualification}</th>
          </tr>
          <tr>
            <th>Address</th>
            <th>{data.address}</th>
          </tr>
          <tr>
            <th>Joining Date</th>
            <th>{moment((new Date(data.joiningDate))).format("MMM DD, YYYY")}</th>
          </tr>
        </thead>
       
      </table>
    </div>
    </div>
    </>
  )
}

export default ViewTeacher