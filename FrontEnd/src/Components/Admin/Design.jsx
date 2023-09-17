import React from "react";
import '../Css/result.css'
const Design = () => {
  return (
    <div className="container result-container">
      <div className="result-header">
        <div className="logo">
          <img src="android-chrome-512x512.png" alt="brand logo" />
        </div>
        <div className="w-75">
        <span className="result-heading Abril ">SHOAIB ACADEMY<h2 className="text-center Tiro">of Commerece & Sciences</h2></span>
        <p className="result-address fw-bolder  text-center Nastaliq">Address: Mian Mustaqim Park, Near Jamia Masjid Siddiq-e-Akbar Harbanspura,  Lahore</p>
        </div>
      </div>
      <p className="mt-2 result-phone Nastaliq">Contact # 0322-8024845</p>
      <div className="result-info-section">
        <h1 className="text-center"> <u>Result Card</u></h1>
        <div className="result-info">
            <div>
            <p>Name: <span>Muaviya</span></p>
            <p>Group: <span>Muaviya</span></p>
            </div>
            <div>
            <p>Class: <span>Muaviya</span></p>
            <p>Date: <span>Muaviya</span></p>
            </div>
        </div>
      </div>
      <table className="table table-success result-table">
        <thead>
            <tr>
                <th>Subjects</th>
                <th>Marks</th>
                <th>Obtained Marks</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>English</th>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th>Urdu</th>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th>Science</th>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th className="text-center">Total</th>
                <td></td>
                <td></td>
            </tr>
        </tbody>
      </table>
      <div className="last-info mt-5">
            <div className="d-flex justify-content-between">
            <p className="attendence">Attendence:<span>&nbsp;</span></p>
            <p>Chracter: <span>&nbsp;</span></p>
            </div>
            <div>
            <p className="comments">Comments: <span>&nbsp;</span></p>
            </div>
        </div>
        <ol className="result-list px-5">
                <li>Monthly result will be announced every 5th of the month.</li>
                <li>Result card will have to be recieved by the Student's Parent</li>
                <li>Student have to submit their fee at 5th of the  month.</li>
        </ol>
    </div>
  );
};

export default Design;
