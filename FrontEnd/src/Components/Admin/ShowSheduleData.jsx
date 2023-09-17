import React from 'react'
import DynamicSelect from './DynamicInput'

const ShowSheduleData = (props) => {
  const handleInputChange = (e, index) => {
    let values = [...props.data];
    if (typeof e === 'object' && e !== null) {
      values[index]['subject'] = e;
    } else {
      values[index][e.target.name] = e.target.value;
    }
    props.setData(values)
  };
const handleSubmit=(e)=>{
    e.preventDefault()
    props.submitData()
}

  return (
    <div className='container my-5'>
        <table className="table table-primary">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Date</th>
        <th scope="col">Day</th>
        <th scope="col">Subject</th>
        <th scope="col">Sallybus</th>
      </tr>
    </thead>
    <tbody>
        {props.data.map((value, index) => {
            return(
      <tr key={index}>
        <th scope="row">{index+1}</th>
        <td>{value.date}</td>
        <td>{value.day}</td>
        <DynamicSelect options={props.subjects} state={props.state?'update':'add'} defaultValue={value.subject} onChange={(e)=>handleInputChange(e,index)}/>
      </tr>

            )
        })}
    
    </tbody>
  </table>
  <button type='submit' className="btn btn-primary mx-auto my-5 d-block" onClick={handleSubmit}><i className={props.state?'bi bi-arrow-repeat':'bi bi-plus-lg'}></i>{props.state?' Confirm and Update':' Confirm & Add Schedule'}</button>
  </div>
  )
}

export default ShowSheduleData