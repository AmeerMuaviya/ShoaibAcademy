import React, { useContext ,useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext'
import axios from '../axiosInstance'
import moment from 'moment'
import { generalContext } from '../contexts/generalContext'
const UserProfiler = () => {
    const [userData, setUserData] = useState()
    let state=useLocation().state
    const {user}=useContext(AuthContext)
    const {url}=useContext(generalContext)
    let uid=state?.uid || user.uid
    function formatInputString(inputString) {
        const words = inputString.split(/(?=[A-Z])/);
        const formattedWords = words.map(word => word.toLowerCase());
        formattedWords[0] = formattedWords[0].charAt(0).toUpperCase() + formattedWords[0].slice(1);
        return formattedWords.join(' ');
      }
    useEffect(() => {
      axios.get(`/users/getUser/${uid}`).then((response) => {
        if(!response.data.err){ 
            let _user=response.data.user
            _user.joiningDate=moment(new Date(_user.joiningDate), "YYYYMMDDHHmm").fromNow()
            if(_user.subjects) _user.subjects=JSON.parse(_user.subjects).join(' , ')

            if(!state){
                let {isActive,phoneNumber,address,id,uid,status,dp,...other}=_user
                setUserData(other)
                return
            }
            let {dp,...other}=_user
            setUserData(other)
        }
      })
    }, [uid,state,user.subjects])
  return userData && (
    <div className='container my-4'>
        <div className="profile-section">
        <img src={parseInt(userData.dp) ? `${url}/getfile/${userData.dp}` : userData.gender === 'Male' ? `/images/profile-boy.webp` : '/images/profile-girl.jpg'} alt="" className='shadow-lg'/>
        <h1 className=""> ~ {userData.fullName}</h1>
        </div>
        <table className="table table-light shadow-lg">
            <tbody>
                {userData && Object.keys(userData).map((value, index) => {
                    return(
                        <tr key={index}>
                            <th>{formatInputString(value)}</th>
                            <td>{userData[value]}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default UserProfiler