import axios from '../axiosInstance'
import {useState,useEffect} from 'react'

const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    axios.get('/subjects').then((response) => {
      if(response.data.subjects) setSubjects(response.data.subjects)
    })
    //eslint-disable-next-line
  }, [])
  return subjects
}
export default useFetchSubjects

