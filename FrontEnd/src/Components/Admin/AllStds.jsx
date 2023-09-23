import React, { useEffect, useContext, useState,useRef } from 'react'
import { Link } from 'react-router-dom'
import '../Css/Teacher.css'
import axios from '../../axiosInstance'
import { generalContext } from '../../contexts/generalContext'

const AllStds = ({state}) => {
  let { showAlert ,classes,url} = useContext(generalContext)
  const [arr, setArr] = useState([])
  const [students, setStudents] = useState(arr)
  const [searchSection, setSearchSection] = useState(false)
  const [searchQuery, setSearchQuery] = useState({ username: '', class: '', gender: '',fullName:"" })
  const buttonRef=useRef(null)

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        buttonRef.current.click();
      }
    }
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const fetchData = async () => {
    let res = await axios.get(state==='all'?'/students/all':'/students/trashed')
    setArr(res.data)
    setStudents(res.data)
  }
  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, [arr.length,state])
  useEffect(() => {
    let stds = arr.filter((value) => {
      if(searchQuery.class==='')
      return value.fullName.toLowerCase().includes(searchQuery.fullName.toLowerCase()) && value.gender.includes(searchQuery.gender)

      else return value.fullName.toLowerCase().includes(searchQuery.fullName.toLowerCase()) && value.class===searchQuery.class && value.gender.includes(searchQuery.gender)
    })
    setStudents(stds)
    return () => {
      setStudents(arr)
    }
    // eslint-disable-next-line 
  }, [searchQuery.class, searchQuery.fullName, searchQuery.gender])

  const handleChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.id]: e.target.value })
  }

  const moveToTrash = (id) => {
    axios.delete(`/students/moveToTrash/${id}`).then((res) => {
      if (res.data.err) showAlert('warning', res.data.msg)
      else showAlert('success', res.data.msg)
      fetchData();
    }
    )
  }
  function recoverStudent(uid){
    axios.post(`/students/recover/${uid}`).then((response) => {
      if(response.data.err)return showAlert('warning',response.data.msg)
      showAlert('success',response.data.msg)
      fetchData();

    })
  }
  function deleteStudent(uid){
    axios.delete(`/students/delete/${uid}`).then((response) => {
      if(response.data.err)return showAlert('warning',response.data.msg)
      showAlert('success',response.data.msg)
      fetchData();
    })
  }

  return (
      <div className="container">

      {searchSection && <div className="mt-4 searchCenter position-relative container rounded my-2 d-flex flex-column gap-2 flex-wrap p-4 shadow-lg">
        <button onClick={() => { setSearchSection(false); setStudents(arr) }} className="position-absolute top-0 start-0 border-none" ref={buttonRef}><i  id='hide-btn' className='hide-btn btn-close ml-2 bg-secondary text-white'></i> </button>
        <input type="search" name="fullName" id="fullName" className='p-2 mt-4 d-inline rounded border' placeholder='Search by Username' onChange={handleChange} />

        <label htmlFor="class">Sort Students by Class
          <select className="form-select mt-0" id='class' onChange={handleChange} aria-label="Default select example" >
            <option value=''>Select Class</option>
            {classes.map((value, index) => {
              return (
                <option key={index}>{value.className}</option>
              )
            })}
          </select></label>
        <label htmlFor="gender">Get Students by Gender
          <select className="form-select mt-0" id='gender' onChange={handleChange} aria-label="Default select example" >
            <option value=''>Select Gender</option>
            <option >Male</option>
            <option >Female</option>
            <option>Other</option>
          </select></label>

      </div>}


      <div className='p-2 my-5 boxShadow rounded position-relative teacherTable' style={{minWidth:'fit-content'}}>

        <h3 className='fw-bolder d-inline-block mb-0 page-heading'>Regestered Students</h3>
        {arr.length ?<button onClick={() => setSearchSection(prev => !prev)} className='btn btn-primary position-absolute top-1 bi bi-search' style={{ right: '10px' }}> Search</button>:null}
        {!students.length ? <h1 className='text-center text-secondary'>No students found</h1> :
          <table className='table mx-auto teacherTable text-center'>
            <thead>
              <tr>
                <th>#</th>
                <th>Picture</th>
                <th>Name</th>
                <th>Class </th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{++index}</td>
                    <td className='teacherProfilePicture'><img src={parseInt(value.dp) ? `${url}/getfile/${value.dp}` : value.gender === 'Male' ? `/images/profile-boy.webp` : '/images/profile-girl.jpg'} alt="" style={{ borderRadius: '100%', width: '55px', height: '55px' }} /></td>
                    <td className='text-uppercase'>{value.fullName}</td>
                   <td>{value.class}</td>
                   <td>{value.age}</td>
                    <td>{state==='trashed'?
                    <div className='d-flex justify-content-center gap-3'>
                        <button className="btn btn-success bi bi-arrow-clockwise" name='recover' onClick={()=>{recoverStudent(value.uid)}}> Recover Student</button>
                        <button name='delete' className="btn btn-danger bi bi-trash3-fill" onClick={()=>{deleteStudent(value.uid)}}> Delete permanantly</button>
                    </div>:
                    <div className="actionButtons w-100 justify-content-around">
                      <Link className="btn btn-primary wide-btn bi bi-pencil-square" to={`/Admin/add-student/?edit=${value.uid}`} state={value}> Edit</Link>
                      <button className="btn btn-warning wide-btn bi bi-trash3-fill" onClick={() => moveToTrash(value.uid)}> Move to trash</button>
                      <Link className="btn btn-success wide-btn bi bi-three-dots" to={`/Admin/view-student/${value.uid}`} state={value}> Details</Link>
                    </div>}
                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>}
      </div>
      </div>
  )
}

export default AllStds
