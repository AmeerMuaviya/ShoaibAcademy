import moment from "moment";
import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import DataTable from "../DataTable";
import UpdateFeeHistory from "./UpdateFeeHistory";
const FeeHistory = (props) => {
  let state = props.state === "unpaid" ? true : false;
  const [history, setHistory] = useState();
  function getRecords() {
    axios
      .get(state ? "/students/unpaid-fee-records" : "/students/all-fee-records")
      .then((response) => {
        //all-students -> (trashed+active)
        axios.get("/students/all-students").then((students) => {
          let _history = response.data.history;
          _history.forEach((value) => {
            let student = students.data.filter(
              (_value) => _value.uid === value.uid
            );
            let slength = student.length;
            if (!state)
              value.submitting_date = moment(value.submitting_date).format(
                "DD MMM, YYYY"
              );
            let error = <span className="text-danger">User not found</span>;
            value["name"] = slength ? getData(student, "fullName") : error;
            value["class"] = slength ? getData(student, "class") : error;
            value["fatherName"] = slength
              ? getData(student, "fatherName")
              : error;
            value["actions"] = <UpdateFeeHistory updateRecord={updateRecord} details={value} />;
          });
          setHistory(_history);
        });
      });
  }
  function updateRecord(){
    getRecords();
  }
  useEffect(() => {
    getRecords();
    //eslint-disable-next-line
  }, [props.state]);
  function getData(students, tofind) {
    return students[0][tofind];
  }

  return (
    <div className="container my-3">
      {history && !history.length ? (
        <>
          <h1 className="page-heading">
            {state ? "Unpaid Records" : "Paid Records"}
          </h1>
          <h2 className="text-center text-secondary">Nothing to show</h2>
        </>
      ) : null}
      {history && history.length ? (
        <DataTable
          state={state}
          heading={state ? "Unpaid Records" : "Paid Records"}
          arrayOfObjects={history}
          keysToDisplay={
            state
              ? ["name", "fatherName", "month", "class"]
              : [
                  "name",
                  "fatherName",
                  "month",
                  "submitting_date",
                  "class",
                  "actions",
                ]
          }
        />
      ) : null}
    </div>
  );
};

export default FeeHistory;
