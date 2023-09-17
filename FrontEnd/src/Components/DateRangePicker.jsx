import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";

const DateRange = ({ setDates ,dates,_state}) => {
  
  const [state, setState] = useState([
    {
      startDate: _state?new Date(dates.idate): new Date(),
      endDate: _state?new Date(dates.fdate): new Date(),
      key: "selection",
    }
  ]);

  function handleSubmit(){
    setDates({ idate: state[0].startDate, fdate: state[0].endDate });
  };


  

  return (
    <div>
      <div
        className="modal fade"
        id="DateModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Select Date Range
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-1">
              <DateRangePicker
                onChange={(item) => setState([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                id="SaveBtn"
                autoFocus
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Select Dates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DateRange;
