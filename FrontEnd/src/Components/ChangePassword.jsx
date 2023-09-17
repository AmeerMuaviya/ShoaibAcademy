import React, { useRef, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../axiosInstance'
import { AuthContext } from "../contexts/authContext";
import { generalContext } from "../contexts/generalContext";
const ChangePassword = () => {
    let [data,setData]=useState({prevPass:'',newPass:''});
    const {user,logout}=useContext(AuthContext)
    const navigate=useNavigate()
    const {showAlert}=useContext(generalContext)
    let alertRef=useRef()
    let uid=user.uid;
   async function handleLogout(){
      await logout();
      navigate('/')
    }
   function handleSubmit(e){
        e.preventDefault()
        axios.post('/auth/changePassword',{...data,uid}).then(async (response) => {
            if(response.data.err)
            return showAlert('warning',response.data.msg)
            alertRef.current.click();
          })
    }
  return (
    <div className='my-4'>
      {/* <!-- Button trigger modal --> */}
<button type="button" ref={alertRef} className="btn btn-primary visually-hidden" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
</button>

{/* <!-- Modal --> */}
<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Password changed successfully</h1>
      </div>
      <div className="modal-body">
        You have to login again! Remember your new password: <br /> <span className="password fs-1">`{data.newPass}`</span>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleLogout}>Understood</button>
      </div>
    </div>
  </div>
</div>
        <form className="special-form bg-none mx-auto p-4 " onSubmit={handleSubmit}>
        <h1 className="page-heading text-white fw-bolder">Stay Updated - Stay Safe</h1>
        <i className="bi bi-shield-lock-fill text-white" style={{fontSize:'200px'}}></i>
      <div className="form-floating mb-3 w-100">
        <input
          type="text"
          required
          autoComplete="off"
          className="form-control fs-4"
          onChange={(e)=>setData({...data,prevPass:e.target.value})}
          id="floatingInput"
          placeholder="Enter your previous password"
        />
        <label htmlFor="floatingInput">Previous password</label>
      </div>
      <div className="form-floating w-100">
        <input
          type="text"
          required
          autoComplete="off"
          className="form-control fs-4"
          onChange={(e)=>setData({...data,newPass:e.target.value})}
          id="floatingPassword"
          placeholder="Enter new password"
          />
        <label htmlFor="floatingPassword">New password</label>
      </div>
      <div>
      <button className="btn btn-secondary fw-bolder fs-4 mt-3 mx-1" type='button' onClick={()=>navigate(-1)} >Go back</button>
      <input type="submit" value="Change password" className="mx-1 btn btn-light mt-3 fw-bolder fs-4" />
      </div>
          </form>
    </div>
  );
};

export default ChangePassword;
