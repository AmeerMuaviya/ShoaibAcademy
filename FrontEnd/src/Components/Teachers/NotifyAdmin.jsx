import React,{useState} from 'react'
import { useContext } from 'react'
import axios from '../../axiosInstance'
import { AuthContext } from '../../contexts/authContext'
import { generalContext } from '../../contexts/generalContext'
const NotifyAdmin = () => {
    let {user}=useContext(AuthContext)
    let {showAlert}=useContext(generalContext)
    const [content, setContent] = useState()
    function handleSubmit(e){
        e.preventDefault();
        axios.post('/notifyAdmin/add',{content,uid:user.uid}).then((response) => {
            let type=response.data.err?'warning':'success'
            showAlert(type,response.data.msg)
        })
        e.target.reset();
    }
  return (
    <div className='container my-4'>
        <form className='special-form mx-auto' onSubmit={handleSubmit}>
  <label for="message" className='fs-1'>Enter Message</label>
  <textarea type="text" required onChange={(e)=>setContent(e.target.value)} className="form-control fs-4" height={{height:'100%'}} id="message" placeholder="Type something..."/>
<button type="submit"className='my-4 btn btn-light bi bi-send-check' > Send now</button>
        </form>
    </div>
  )
}

export default NotifyAdmin