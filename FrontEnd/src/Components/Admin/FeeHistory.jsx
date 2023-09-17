import moment from 'moment'
import React,{useState,useEffect} from 'react'
import axios from '../../axiosInstance'
import DataTable from '../DataTable'
const FeeHistory = (props) => {
    let state=props.state==='unpaid'?true:false;
    const [history, setHistory] = useState()
    function getRecords(){
        axios.get(state?'/students/unpaid-fee-records':'/students/all-fee-records').then((response) => {
            axios.get('/students/all').then((students) => {
                let _history=response.data.history
                _history.forEach((value) => {
                    if(!state) value.submitting_date=moment(new Date(value.submitting_date), "YYYYMMDDHHmm").fromNow()
                    value['name']=getData(students.data,value.uid,'fullName')
                    value['class']=getData(students.data,value.uid,'class')
                })
                setHistory(_history)
            })
        })
    }
  
    useEffect(() => {
    getRecords();
     //eslint-disable-next-line
    }, [props.state])
    function getData(students,uid,tofind){
        let student= students.filter((value) => value.uid===uid);
        if(student.length)
        return student[0][tofind]
        return <span className='text-danger'>User not found</span>
    }
    
    
  return (
    <div className='container my-3 '>
        {history && (
          <DataTable
            state={state}
            heading={state?'Unpaid Records':'Paid Records'}
            arrayOfObjects={history}
            keysToDisplay={state?["name","month","class"]:["name","submitting_date","month","class"]}
          />
        )}
    </div>
  )
}

export default FeeHistory