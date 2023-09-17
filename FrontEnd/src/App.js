 /* eslint-disable */ 
import './App.css';
import LocalHome from './Components/Local/LocalHome';
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from './Components/Students/Sidebar';
import './Components/Css/Teacher.css'
import Schedules from './Components/Students/Schedules';
import AddNotifications from './Components/AddNotifications';
import { useEffect, useState } from 'react';
import Notes from './Components/Students/Notes';
import TeacherSidebar from './Components/Teachers/Sidebar';
import AddSchedule from './Components/Admin/AddSchedule';
import UploadNotes from './Components/Teachers/UploadNotes';
import Login from './Components/Login';
import AllSchedules from './Components/Admin/AllSchedules';
import AddStudent from './Components/Admin/AddStudent';
import AllStds from './Components/Admin/AllStds';
import PermoteStudents from './Components/Admin/PermoteStudents';
import AddTeacher from './Components/Admin/AddTeacher';
import RegesteredTeachers from './Components/Admin/RegesteredTeachers';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import ValidateUser from './Components/ValidateUser';
import { useContext } from 'react';
import { AuthContext } from './contexts/authContext';
import ProgressBar from './ProgressBar';
import axios from './axiosInstance';
import Loader from './Components/Loader';
import Alert from './Components/Alert';
import { generalContext } from './contexts/generalContext';
import ViewStd from './Components/Admin/ViewStd';
import ManageClasses from './Components/Admin/ManageClasses';
import AddMarks from './Components/Admin/AddMarks';
import ViewOrUpdateMarks from './Components/Admin/ViewOrUpdateMarks';
import ViewTeacher from './Components/Admin/ViewTeacher';
import PrintResult from './Components/Admin/PrintResult';
import ResultTable from './Components/Admin/ResultTable';
import ReviewPrintTest from './Components/Admin/ReviewPrintTest';
import AllNotifications from './Components/Admin/AllNotifications';
import AllNotes from './Components/Admin/AllNotes';
import StHome from './Components/Students/StHome'
import Blogs from './Components/Admin/Blogs';
import PayFee from './Components/Admin/PayFee';
import FeeHistory from './Components/Admin/FeeHistory';
import ManageAdmins from './Components/Admin/ManageAdmins';
import Notifications from './Components/Notifications';
import NotifyAdmin from './Components/Teachers/NotifyAdmin';
import NotificationsForMe from './Components/Admin/NotificationsForMe';
import Home from './Components/Home';
import SubjectsUpdater from './Components/Admin/SubjectsUpdater';
import UserProfiler from './Components/UserProfiler';
import ChangePassword from './Components/ChangePassword';
import Layout from './Components/Admin/Layout';
import About from './Components/Local/About';
import Error from './Components/Error';
import PrintCards from './Components/Admin/PrintCards';
import PreviewPrintCard from './Components/Admin/PreviewPrintCard';
function App() {
  const [loader, setLoader] = useState(true)
  const {alert,showAlert,progress}=useContext(generalContext)
  let { user, setUser } = useContext(AuthContext)
  let navigate = useNavigate()
  async function verifyuser() {
    let res = await axios.post('/auth/verifyuser')
    setUser(res.data)
    setTimeout(() => {
      if (res.data) {
        navigate(`/${res.data.status}`)
        showAlert('success','Welcome Back') 
      }
      setLoader(false)
    }, 1000);
  }
  useEffect(() => {
    verifyuser()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {loader ? <Loader /> :
        <>
         <Alert alert={alert}/>
          <ProgressBar value={progress} />
            <Routes>
              
              <Route path="/" element={<LocalHome />} />
              <Route path="/about" element={<About />} />
              <Route path="/Adminn" element={<Login user='Admin'/>} />
              <Route path="/TeacherLogin" element={<Login user='Teacher'/>} />
              <Route path="/StudentLogin" element={<Login user='Student'/>} />

              <Route element={<ValidateUser orgUser={'Student'}/>}>
                <Route path='/Student' element={<Sidebar/>} >
                  <Route index element={<StHome/>} />
                  <Route path="schedules" element={<Schedules/>} />
                  <Route path="notifications" element={<Notifications/>} />
                <Route path="change-password/" element={<ChangePassword />} />
                  <Route path="notes" element={<Notes/>} />
                  <Route path="about-me" element={<UserProfiler />} />
                </Route>
              </Route>


             <Route element={<ValidateUser orgUser={'Teacher'}/>}>
              <Route path="/Teacher" element={<TeacherSidebar />}>
                <Route index element={<Home />} />
                <Route path='add-schedule' element={<AddSchedule />} />
                <Route path='all-schedules' element={<AllSchedules state='all' />} />
                <Route path='trashed-schedules' element={<AllSchedules state='trashed' />}/>
                <Route path="notifications" element={<Notifications />} />
                <Route path="notes" element={<UploadNotes />} />
                <Route path="notify-admin" element={<NotifyAdmin />} />
                <Route path="about-me" element={<UserProfiler />} />
                <Route path="change-password/" element={<ChangePassword />} />
                <Route path="add-marks/" element={<AddMarks />} />
                <Route path="view-marks/" element={<ViewOrUpdateMarks />} />
              </Route>
              </Route>

             <Route element={<ValidateUser orgUser={'Admin'}/>}>
              <Route path="/Admin" element={<Layout/>}>
                <Route index element={<Dashboard />} />
                <Route path='add-schedule' element={<AddSchedule />} />
                <Route path='manage-classes' element={<ManageClasses />} />
                <Route path='all-schedules' element={<AllSchedules state='all'/>} />
                <Route path='trashed-schedules' element={<AllSchedules state='trashed' />} />
                <Route path='add-student' element={<AddStudent />} />
                <Route path='all-students' element={<AllStds state='all'/>} />
                <Route path='permote-students' element={<PermoteStudents />} />
                <Route path='print-cards' element={<PrintCards />} />
                <Route path='trashed-students' element={<AllStds state='trashed' />} />
                <Route path='add-teacher' element={<AddTeacher />} />
                <Route exact path='registered-teachers' element={<RegesteredTeachers state='registered' />} />
                <Route exact path='view-teacher/:id' element={<ViewTeacher state='registered' />} />
                <Route exact path='trashed-teachers' element={<RegesteredTeachers state='trashed' />} />
                <Route path="notify-teachers" element={<AddNotifications notify='Teachers' />} />
                <Route path="notify-students" element={<AddNotifications notify='Students' />} />
                <Route path="all-notifications" element={<AllNotifications />} />
                <Route path="notifications-for-me" element={<NotificationsForMe />} />
                <Route path="add-notes" element={<UploadNotes />} />
                <Route path="all-notes" element={<AllNotes />} />
                <Route path="view-student/:id" element={<ViewStd />} />
                <Route path="view-student/:id/sent-notifications" element={<AllNotifications />} />
                <Route path="view-student/:id/sent-notes" element={<AllNotes />} />
                <Route path="view-student/:id/sent-schedules" element={<Schedules />} />
                <Route path="add-marks/" element={<AddMarks />} />
                <Route path="view-marks/" element={<ViewOrUpdateMarks />} />
                <Route path="print-result/" element={<PrintResult />} />
                <Route path="view-print-info/" element={<ReviewPrintTest />} />
                <Route path="manage-blogs/" element={<Blogs />} />
                <Route path="pay-fee/" element={<PayFee />} />
                <Route path="all-fee-records/" element={<FeeHistory state='all' />} />
                <Route path="unpaid-fee-records/" element={<FeeHistory state='unpaid' />} />
                <Route path="manage-admins/" element={<ManageAdmins />} />
                <Route path="update-subjects/" element={<SubjectsUpdater />} />
                <Route path="view-user/" element={<UserProfiler />} />
                <Route path="change-password/" element={<ChangePassword />} />
              </Route>
                <Route path="/Admin/view-result-cards/" element={<ResultTable />} />
                <Route path="/Admin/print-student-cards/" element={<PreviewPrintCard />} />
              </Route> 
              <Route path="*" element={<Error />} />
              <Route path="not-found" element={<Error />} />
            </Routes>
        </>
      }
    </>
  );
}

export default App;
