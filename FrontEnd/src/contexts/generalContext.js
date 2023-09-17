import { useState, createContext, useEffect } from "react";
import axios from "../axiosInstance";
export const generalContext = createContext();
const url = process.env.REACT_APP_SERVER_URL;
export const GeneralContext = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [progress, setProgress] = useState(0);
  const [classes, setClasses] = useState([]);
  const [nCounts, setNCounts] = useState(0);
  const [title, setTitle] = useState("Shoaib Academy");
  useEffect(() => {
    getClasses();
  }, []);
  let testTypes = ["Daily", "Weekly", "Monthly", "Session", "Class"];
  const getClasses = async () => {
    let response = await axios.get("/classes/getAllClasses");
    setClasses(response.data.classes);
  };

  function getday(day) {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  }
  function showAlert(messageType, message,time=3000) {
    setAlert({
      msg: message,
      type: messageType,
    });
    setTimeout(() => {
      setAlert(null);
    }, time);
  }
  const capitallizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  let data = {
    url,
    alert,
    showAlert,
    capitallizeFirstLetter,
    progress,
    setProgress,
    getday,
    classes,
    testTypes,
    nCounts,
    setNCounts,
    title,
    setTitle,
    setClasses,
  };
  return (
    <generalContext.Provider value={data}>{children}</generalContext.Provider>
  );
};
