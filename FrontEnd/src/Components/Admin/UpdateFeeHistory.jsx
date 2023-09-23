import axios from "../../axiosInstance";
import React, { useContext, useEffect, useRef, useState } from "react";
import { generalContext } from "../../contexts/generalContext";

const UpdateFeeHistory = ({ details, updateRecord }) => {
  const { showAlert } = useContext(generalContext);
  let closeBtn = useRef(null);
  const [date, setDate] = useState(details.month);
  useEffect(() => {
    setDate(details.month);
  }, [details.month]);
  async function updateDate() {
    let response = await axios.post(`/students/update-fee/${details.id}`, {
      month: date,
    });
    const type = response.data.err ? "danger" : "success";
    showAlert(type, response.data.msg);
    updateRecord();
    if (closeBtn !== null) {
      closeBtn.current.click();
    }
  }
  async function deleteRecord() {
    const response = await axios.delete(
      `/students/delete-fee-record/${details.id}`
    );
    const type = response.data.err ? "danger" : "success";
    showAlert(type, response.data.msg);
    updateRecord();
    if (closeBtn !== null) {
      closeBtn.current.click();
    }
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${details.id}`}
      >
        <i className="bi bi-gear-fill"></i>
      </button>

      <div
        className="modal fade"
        id={`exampleModal-${details.id}`}
        tabIndex="-1"
        aria-labelledby={`exampleModalLabel-${details.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id={`exampleModalLabel-${details.id}`}
              >
                Edit fee details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeBtn}
              ></button>
            </div>
            <div className="modal-body">
              <div className="fs-4 d-flex w-75 mx-auto flex-column" style={{textAlign:"start"}}>
                <div>
                  <span>Name: </span>
                  <span className="text-primary text-uppercase">
                    &nbsp;&nbsp;{details.name}
                  </span>
                </div>
                <div>
                  <span>Father Name: </span>
                  <span className="text-primary">
                    &nbsp;&nbsp;{details.fatherName}
                  </span>
                </div>
                <div>
                  <span>Class: </span>
                  <span className="text-primary">
                    &nbsp;&nbsp;{details.class}
                  </span>
                </div>
              </div>
              <input
                type="month"
                name="month"
                className="w-75"
                onChange={(e) => setDate(e.target.value)}
                required
                value={date}
              />
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteRecord}
              >
                Delete Record
              </button>
              <button
                type="button"
                onClick={updateDate}
                className="btn btn-primary"
              >
                Update Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFeeHistory;
