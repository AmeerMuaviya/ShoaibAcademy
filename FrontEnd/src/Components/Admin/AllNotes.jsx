import React,{useEffect,useState,useContext} from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from '../../axiosInstance'
import { generalContext } from "../../contexts/generalContext";
import Modal from '../Modal';

const AllNotes = () => {
  let state=useLocation().state
  let { showAlert,url } = useContext(generalContext);
  const [modalData, setModalData] = useState();

    const [notes, setNotes] = useState()
    function getAllNotes(){
        axios.get(state?`/notes/all/${state.uid}`:'/notes/all').then((response) => {
            setNotes(response.data.notes)
        })
    }
    useEffect(() => {
     getAllNotes();
     //eslint-disable-next-line
    }, [state])
    const prepareData = (users) => {
      setModalData("Loading...");
      let list = JSON.parse(users);
      if(!list.length) return setModalData('No data found...')
      axios.post(`/students/getStudentsByList`, { list }).then((response) => {
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
    function deleteNotes(id){
      axios.delete(`/notes/delete/${id}`).then((response) => {
        let type=response.data.err?'warning':'success'
        showAlert(type,response.data.msg)
        getAllNotes();
      })
    }
  return (
    <div className='container my-3'>
      <h1 className="page-heading">All sent notes</h1>
      <Modal modalId={"Users"} body={modalData} title='Users who will get this notification' cancelOnly />

        {notes && notes.map((value, index) => 
        (<div key={index} className="card text-center special-card mx-auto">
        <div className="card-header d-flex justify-content-between">
          Sent by {value.Auther}
          <div>
          <button
                  type="button"
                  className="btn btn-primary mx-1 bi bi-people-fill"
                  data-bs-toggle="modal"
                  data-bs-target={"#Users"}
                  onClick={() => prepareData(value.users)}
                  > Users
                </button>
          <button
                  type="button"
                  className="btn btn-danger mx-1 bi bi-trash3-fill"
                  onClick={() => deleteNotes(value.id)}
                  > Delete
                </button>
                    </div>
        </div>
        <div className="card-body">
          <p className="card-text">{value.description}</p>
          <a href={`${url}/getdoc/${value.doc}`} className="btn btn-primary bi bi-download">&nbsp; Download File</a>
        </div>
      </div>

        ))}
        {notes && !notes.length && <h2 className='text-secondary text-center'>Nothing to display!</h2>}
    </div>
  )
}

export default AllNotes