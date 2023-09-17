import axios from 'axios'
const url=process.env.REACT_APP_SERVER_URL
const instance = axios.create({
    baseURL: url,
    withCredentials:true
  });

  export default instance;