import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
const AdminSidebar = (props) => {
  const { sidebar, setSidebar } = props;
  const { user } = useContext(AuthContext);
  const { setNCounts, nCounts } = useContext(generalContext);
  let toggleSidebar = () => setSidebar(!sidebar);
  useEffect(() => {
    // Function to check if the #AdminSidebar has fixed position
    const isAdminSidebarSticky = () => {
      const adminSidebar = document.getElementById('AdminSidebar');
      if (adminSidebar) {
        const computedStyle = getComputedStyle(adminSidebar);
        return computedStyle.position === 'fixed';
      }
      return false;
    };
  
    if (isAdminSidebarSticky()) {
      let listener = () => {
        setSidebar(false);
      };
      let element = document.getElementsByClassName('sidebarElem');
      Array.from(element).forEach((elem) => {
        elem.addEventListener('click', listener);
      });
  
      return () => {
        Array.from(element).forEach((elem) => {
          elem.removeEventListener('click', listener);
        });
      };
    }
  }, [sidebar,setSidebar]);
  
  useEffect(() => {
    axios.get(`/notifyAdmin/get-unseen`).then((response) => {
      setNCounts(response.data.count);
    });
    //eslint-disable-next-line
  }, [user.uid]);
  let personelVcard = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-person-vcard"
      viewBox="0 0 16 16"
    >
      <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" />
      <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z" />
    </svg>
  );
  return (
    <>
      <aside
        id="AdminSidebar"
        className={sidebar ? "showSidebar" : "hideSidebar"}
      >
        <div className="header d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between w-75 align-content-center">
            <span
              type="button"
              onClick={toggleSidebar}
              className="hide bi bi-list hide fs-2"
            ></span>
            <h4 className="fw-bolder small-title m-0 fs-3">{user.fullName}</h4>
          </div>
        </div>
        <hr />
        <ul className="scroller p-0">
          <Link to="/Admin/" className="li sidebarElem">
            <i className="bi bi-house-door-fill"></i>Home
          </Link>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item border-none">
              <h2 className="accordion-header" id="headingFirst">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFirst"
                  aria-expanded="false"
                  aria-controls="collapseFirst"
                >
                  <i className="bi bi-calendar2-range-fill"></i> Manage
                  Schedules
                </button>
              </h2>
              <div
                id="collapseFirst"
                className="accordion-collapse collapse"
                aria-labelledby="headingFirst"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    to="/Admin/add-schedule"
                    className="sub-li sidebarElem bi bi-plus-lg"
                  >
                    {" "}
                    Add Schedule
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-card-checklist"
                    to="/Admin/all-schedules"
                  >
                    {" "}
                    All Schedules
                  </Link>
                  <Link
                    to="/Admin/trashed-schedules"
                    className="sub-li sidebarElem bi bi-trash3-fill"
                  >
                    {" "}
                    Trashed Schedule
                  </Link>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <i className="bi bi-person-lines-fill"></i>Manage Students
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    className="sub-li sidebarElem bi bi-plus-lg"
                    to="/Admin/add-student"
                  >
                    {" "}
                    Add Student
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-card-checklist"
                    to="/Admin/all-students"
                  >
                    {" "}
                    All Students
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-trash3-fill"
                    to="/Admin/trashed-students"
                  >
                    {" "}
                    Trashed Students
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-graph-up-arrow"
                    to="/Admin/permote-students"
                  >
                    {" "}
                    Permote Students
                  </Link>
                  <Link className="sub-li sidebarElem" to="/Admin/print-cards">
                    {" "}
                    <div className="d-flex align-items-center">
                      {personelVcard} &nbsp; Print Cards
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <i className="bi bi-person-workspace"></i> Manage Teachers
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    to="/Admin/add-teacher"
                    className="sub-li bi bi-person-plus-fill sidebarElem"
                  >
                    {" "}
                    Add Teacher
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-card-list"
                    to="/Admin/registered-teachers"
                  >
                    {" "}
                    All Teachers
                  </Link>
                  <Link
                    className="sub-li sidebarElem bi bi-trash3-fill"
                    to="/Admin/trashed-teachers"
                  >
                    {" "}
                    Trashed Teachers
                  </Link>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  <i className="bi bi-app-indicator"></i>Manage Notifications
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    to="/Admin/notify-students"
                    className="sub-li bi bi-person-fill sidebarElem"
                  >
                    {" "}
                    Notify Students
                  </Link>
                  <Link
                    className="sub-li bi bi-person-workspace sidebarElem"
                    to="/Admin/notify-teachers"
                  >
                    {" "}
                    Notify Teachers
                  </Link>
                  <Link
                    to="/Admin/all-notifications"
                    className="sub-li bi bi-card-checklist sidebarElem"
                  >
                    {" "}
                    All Notifications
                  </Link>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFive"
                  aria-expanded="false"
                  aria-controls="collapseFive"
                >
                  <i className="bi bi-journal-text"></i> Manage Notes
                </button>
              </h2>
              <div
                id="collapseFive"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    to="/Admin/add-notes"
                    className="sub-li bi bi-filetype-doc sidebarElem"
                  >
                    {" "}
                    Upload Notes
                  </Link>
                  <Link
                    className="sub-li bi bi-file-earmark-check sidebarElem"
                    to="/Admin/all-notes"
                  >
                    {" "}
                    All Notes
                  </Link>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button li collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSix"
                  aria-expanded="false"
                  aria-controls="collapseSix"
                >
                  <i className="bi bi-coin"></i>Manage Fee
                </button>
              </h2>
              <div
                id="collapseSix"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Link
                    to="/Admin/pay-fee"
                    className="sub-li bi bi-plus-lg sidebarElem"
                  >
                    {" "}
                    Add New Record
                  </Link>
                  <Link
                    to="/Admin/all-fee-records"
                    className="sub-li bi bi-card-checklist sidebarElem"
                  >
                    {" "}
                    Paid records
                  </Link>
                  <Link
                    className="sub-li bi bi-window-x sidebarElem"
                    to="/Admin/unpaid-fee-records"
                  >
                    {" "}
                    Unpaid Records
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/Admin/notifications-for-me" className="li sidebarElem">
              <i className="bi bi-bell-fill"></i>Notifications
              {nCounts >= 1 && (
                <span className="bg-danger badge mx-2">{nCounts}</span>
              )}
            </Link>
          <Link to="/Admin/manage-classes" className="li sidebarElem">
            <i className="bi bi-c-square"></i>Manage Classes
          </Link>
          <Link to="/Admin/manage-admins" className="li sidebarElem">
            <i className="bi bi-people-fill"></i>Manage Admins
          </Link>
          <Link to="/Admin/change-password" className="li sidebarElem">
            <i className="bi bi-shield-fill-check"></i>Change Password
          </Link>
          <Link to="/Admin/print-result" className="li sidebarElem">
            <i className="bi bi-printer-fill"></i>Print Result
          </Link>
          <Link
            to="/Admin/manage-blogs"
            style={{ minHeight: "length" }}
            className="li sidebarElem"
            >
            <i className="bi bi-megaphone-fill"></i>Blogs/Broadcast
          </Link>
            </div>
        </ul>
      </aside>
    </>
  );
};

export default AdminSidebar;
