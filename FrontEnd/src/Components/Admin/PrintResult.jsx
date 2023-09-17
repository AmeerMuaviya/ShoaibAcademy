import React, { useState, useContext, useEffect } from "react";
import DateRange from "../DateRangePicker";
import { generalContext } from "../../contexts/generalContext";
import axios from "../../axiosInstance";
import DataTable from "../DataTable";
import { Link } from "react-router-dom";
const PrintTests = () => {
  let { classes, showAlert ,testTypes} = useContext(generalContext);
  const [dates, setDates] = useState({});
  const [inputs, setInputs] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [testCounter, setTestCounter] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
    useEffect(() => {
      setInputs({...inputs,...dates})
      //eslint-disable-next-line
    }, [dates.idate,dates.fdate])
    // solve modal problem
    // solve printing problem
  function getAllStudents() {
    axios.get(`/students/getStudentsByClass/${inputs.className}`).then((response) => {
      setStudents(removeDuplicateObjects([...students, ...response.data.students]));
    });
  }
  function removeDuplicateObjects(objects) {
    if (!objects.length) return [];
    let uniqueIds=[...new Set(objects.map((value) => value.uid))]
    let uniqueObjects = [];
   uniqueIds.forEach((value) => {
    uniqueObjects.push(objects.filter((_value) => _value.uid===value)[0])
   })
    return uniqueObjects;
  }
  function isBetweenDates(dateStr, startDate, endDate) {
    let date = new Date(dateStr);
    return date >= startDate && date <= endDate;
  }
  useEffect(() => {
    if (inputs.className !== ""){
      getAllStudents();
    }
    //eslint-disable-next-line  
  }, [inputs.className])
  
  useEffect(() => {
    if (inputs.className !== "" && inputs.testType !== ""){
    axios
    .get(`/schedules/getAllSchedulesByClass/${inputs.className}/${inputs.testType}`)
    .then((response) => {
      let schedules = response.data.schedules;
        schedules.forEach((value) => {
              JSON.parse(value.data).forEach((value) => {
                if (Object.keys(value.result).length && isBetweenDates(value.date, inputs.idate, inputs.fdate))
                  setTestCounter((prev) => prev + 1);
              });
            });
          });
        }
      else setStudents([])
      return ()=>{
        setTestCounter(0)
      }
    //eslint-disable-next-line
  }, [inputs.className, inputs.testType,inputs.idate,inputs.fdate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputs.idate && !inputs.fdate)
      showAlert("warning", "Dates can not be null");
    else if (!inputs.className)
      showAlert("warning", "Please select at least one class");
    else if (!inputs.testType)
      showAlert("warning", "Please select at least one category");
    else if (!selectedStudents.length)
      showAlert("warning", "Please select at least one Student");
    else if (testCounter===0)
      showAlert("warning", "No Tests found with given data. Please ensure correct input values");
    else {
      setShowTable(true)
    };
  }
  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value, ...dates });
  }
  return (
    <div className="container my-4">
      <h1 className="page-heading">Enter Schedule information</h1>
      <div className="special-form mx-auto my-2 ">

      <DateRange setDates={setDates} dates={dates} />
      <button
        type="button"
        className="btn btn-light form-control stdform-item"
        data-bs-toggle="modal"
        data-bs-target="#DateModal"
      >
        Pick a date Range
      </button>
      <select name="className" className="form-control stdform-item" required onChange={handleChange}>
        <option value="">Select Classes</option>
        {classes.map((value, index) => (
          <option key={index + value}>
            {value.className}
          </option>
        ))}
      </select>
      <select name="isCollective" className="form-control stdform-item" required onChange={handleChange}>
        <option value="">Print Test as</option>
        <option value={1}>Collectively Marked</option>
        <option value={0}>Individually Marked</option>
      </select>
      <select name="testType" className="form-control stdform-item" onChange={handleChange}>
        <option value="">Select Test Category</option>
        {testTypes.map((value, index) =><option key={index}>{value}</option>)}
      </select>
      </div>
      {students && (!students.length ? (
        <h3 className="text-secondary text-center">
          Choose correct class name and test type according to schedule in order to get 
          respective students
        </h3>
      ) : (
        students.length && (
          <DataTable
          heading="All Students"
          arrayOfObjects={students}
          selectedStudents={selectedStudents}
          onChange={setSelectedStudents}
          keysToDisplay={["username", "class", "gender"]}
          />)
        )
      )}
       <button className="btn btn-primary d-block mx-auto" onClick={handleSubmit}>
        Check for available tests
      </button>
      {showTable && (testCounter >= 1 ? 
        <Link
          to="/Admin/view-result-cards"
          state={{ selectedStudents, inputs }}
          className='btn btn-primary mx-3'
        >
         Result found Get Result
        </Link>
       : 
        <span className="text-warning fs-3">
          No tests found with given data
        </span>)
      }
    </div>
  );
};

export default PrintTests;
