import React, { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { generalContext } from "../contexts/generalContext";
import './Css/Home.css';
import './Css/Quote.scss';
import obj from "./Quotes";
const Home = () => {
  const { user } = useContext(AuthContext);
  const { url } = useContext(generalContext);
  return <div style={{overflow:'hidden'}}>
    {user.status!=='Admin' ? <div className="home-main-container mb-5">
    {user.status==='Admin'?
    <img alt="admin dp" src="/images/admin.webp"/>:<img src={parseInt(user.dp) ? `${url}/getfile/${user.dp}` : user.gender === 'Male' ? `/images/profile-boy.webp` : '/images/profile-girl.jpg'} alt="user dp"/>}
    <span><span className="welcome text-white fs-dangerk">Welcome Dear</span>
    <span className="username fs-Charmonman fw-bold">{user.fullName}</span></span>
    </div>:null}
    <div className="quote mb-5">
    <h2 className="m-0 mt-5">Quote of the day</h2>
    <div>
      {(user.status==='Teacher' || user.status==='Admin')?
        <><p>{obj.Teacher.quote}</p>
        <h4 align="right">-{obj.Teacher.author}</h4></>
        :<><p>{obj.Student.quote}</p>
        <h4 align="right">-{obj.Student.author}</h4></>
      }
    </div>
    </div>
    <div className="my-4">
        <h1 className="Rock gudLuck text-center">Good Luck from creator_ _ _</h1>
    </div>
  </div>;
};

export default Home;
