import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { generalContext } from "../../contexts/generalContext";
import axios from "../../axiosInstance";
import useFetchSubjects from "../useFetchSubjects";
import ShowSheduleData from "./ShowSheduleData";
import DateRange from "../DateRangePicker";
import { addDays } from "date-fns";

const AddSchedule = () => {
  let _subjects = useFetchSubjects();
  const navigate = useNavigate();
  let { classes, testTypes, showAlert, capitallizeFirstLetter } =
    useContext(generalContext);
  let state = useLocation().state;
  const { user } = useContext(AuthContext);
  const [table, setTable] = useState(state ? true : false);
  const [subjects, setSubjects] = useState([]);
  const [dates, setDates] = useState({});
  const [inputs, setInputs] = useState({
    className: state?.className || "",
    testType: state?.testType || "",
    idate: state ? new Date(state.idate) : new Date(),
    fdate: state ? new Date(state.fdate) : new Date(),
  });
  useEffect(() => {
    setInputs({ ...inputs, ...dates });
    //eslint-disable-next-line
  }, [dates]);
  useEffect(() => {
    if (inputs.className !== "") {
      let a = classes.filter((value) => value.className === inputs.className); 
      if (a.length)
        setSubjects([
          ...new Set(...a.map((value) => JSON.parse(value.subjects))),
        ]);
      // ([...new Set(...a)].map(value=>JSON.parse(value.subjects)))
      else setSubjects(_subjects);
    }
    //eslint-disable-next-line
  }, [inputs.className, classes]);

  const [data, setData] = useState(
    state
      ? JSON.parse(state.data)
      : [{ date: "", day: "", subject: "", sallybus: "", isChecked: false }]
  );
  function dayOfWeekAsString(dayIndex) {
    if (dayIndex >= 7) dayIndex = Math.floor(dayIndex % 7);
    return (
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayIndex] || ""
    );
  }
  function getTotalDays(idate, fdate) {
    const dateOneUTC = Date.UTC(
      idate.getFullYear(),
      idate.getMonth(),
      idate.getDate()
    );
    const dateTwoUTC = Date.UTC(
      fdate.getFullYear(),
      fdate.getMonth(),
      fdate.getDate()
    );
    const difference = dateTwoUTC - dateOneUTC;
    return difference / (1000 * 60 * 60 * 24);
  }

  useEffect(() => {
    let a = [];
    for (let i = 0; i <= getTotalDays(inputs.idate, inputs.fdate); i++) {
      a.push({
        date: toHtmlDate(addDays(new Date(inputs.idate), i)),
        day: dayOfWeekAsString(inputs.idate.getDay() + i),
        subject: data[i]?.subject || { "": "" },
        isChecked: data[i]?.isChecked === true || false,
        result: data[i]?.result || {},
      });
    }
    setData(a);
    //eslint-disable-next-line
  }, [inputs.idate, inputs.fdate]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  function toHtmlDate(dateString) {
    const jsDate = new Date(dateString);
    const htmlDate =
      jsDate.getMonth() +
      1 +
      "-" +
      jsDate.getDate() +
      "-" +
      jsDate.getFullYear();
    return htmlDate;
  }
  const submitData = () => {
    if (inputs.idate > inputs.fdate)
      return showAlert(
        "warning",
        `InitialDate Can't be greater than Final Date`
      );
    let obj = {
      teacherName: user.fullName,
      publishingTime: new Date(),
      data,
      ...inputs,
      sid: Date.now(),
    };
    axios
      .post(
        state
          ? `/schedules/updateSchedule/${state.sid}`
          : "/schedules/addSchedule",
        obj
      )
      .then((response) => {
        if (!response.data.err) {
          showAlert(
            "success",
            state
              ? "Schedule Updated Successfully :)"
              : "Schedule added Successfully :)"
          );
          navigate(`/${capitallizeFirstLetter(user.status)}/all-schedules`);
        } else showAlert("warning", response.data.msg);
      });
  };
  function handleFormSubmit(e) {
    e.preventDefault();
    if (inputs.idate > inputs.fdate)
      return showAlert(
        "warning",
        `InitialDate Can't be greater than Final Date`
      );
    setTable(true);
  }
  return (
    <div className="container mt-5 mx-auto">
      <h1 className="page-heading">Enter Schedule info</h1>
      <form
        className="inputFields special-form mx-auto"
        onSubmit={handleFormSubmit}
      >
        <select
          defaultValue={inputs.className}
          required
          name="className"
          className="form-select fs-5"
          aria-label="Default select example"
          onChange={handleInputChange}
        >
          <option value="">Select Class</option>
          {classes.map((value, index) => (
            <option key={index}>{value.className}</option>
          ))}
        </select>

        <select
          defaultValue={inputs.testType}
          required
          className="form-select fs-5"
          onChange={handleInputChange}
          name="testType"
          aria-label="Select Test Type"
        >
          <option value="">Select Test Type</option>
          {testTypes.map((value, index) => (
            <option key={index}>{value}</option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-light block-btn w-100 fs-5"
          data-bs-toggle="modal"
          data-bs-target="#DateModal"
        >
          Pick a date range
        </button>
        <DateRange
          setDates={setDates}
          dates={{ idate: inputs.idate, fdate: inputs.fdate }}
          _state={state}
        />
        {inputs.idate !== null && inputs.fdate !== null ? (
          <p className="text-white fs-3">
            {toHtmlDate(inputs.idate)}{" "}
            <i className="bi bi-arrow-right text-white"></i>{" "}
            {toHtmlDate(inputs.fdate)}{" "}
          </p>
        ) : (
          <p className="text-secondary fs-3">Selected dates will appear here</p>
        )}
        {!state ? (
          <input
            type="submit"
            className="btn btn-success mt-3 w-100 d-block mx-auto fw-bolder"
            value={"Get Started"}
          />
        ) : null}
      </form>
      {table ? (
        <ShowSheduleData
          subjects={subjects}
          data={data}
          setData={setData}
          submitData={submitData}
          state={state}
        />
      ) : null}
    </div>
  );
};

export default AddSchedule;
