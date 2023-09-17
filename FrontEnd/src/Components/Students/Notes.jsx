import React,{useContext, useEffect,useState} from 'react'
import axios from '../../axiosInstance'
import { AuthContext } from '../../contexts/authContext'
import { generalContext } from '../../contexts/generalContext'
const AllNotes = () => {
  const {url}=useContext(generalContext)
  const {user}=useContext(AuthContext)
    const [notes, setNotes] = useState()
    function getAllNotes(){
        axios.get(`/notes/all/${user.uid}`).then((response) => {
            setNotes(response.data.notes)
        })
    }
    useEffect(() => {
     getAllNotes();
     //eslint-disable-next-line
    }, [user.uid])
    
  return (
    <div className='container my-4'>
      <h1 className="page-heading">All notes</h1>
      {(!notes || !notes.length)?<h2 className='text-secondary text-center'>No notes found</h2>:null}
        {notes && notes.map((value, index) => 
        (<div key={index} className="card text-center special-card mx-auto">
        <div className="card-header">
          Sent by {value.Auther}
        </div>
        <div className="card-body">
          <p className="card-text">{value.description}</p>
          <a href={`${url}/getdoc/${value.doc}`} className="btn btn-primary">Download File</a>
        </div>
      </div>

        ))}
    </div>
  )
}

export default AllNotes