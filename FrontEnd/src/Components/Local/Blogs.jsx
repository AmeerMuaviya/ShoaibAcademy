import React,{useEffect,useState} from 'react'
import axios from '../../axiosInstance'
const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    axios.get('/blogs/all').then((response) => {
      if(!response.data.err)  setBlogs(response.data.blogs)
    })
  }, [])
  
  return blogs.length?(
    <div id='blogs'>
       <h2 className="text-center">Blogs/Announcements</h2>
       <div className='d-flex justify-content-around flex-wrap'>
       {blogs && blogs.length &&blogs.map((value, index) => {
         return (
           <div key={index} className='st-cards-section'>
                  <div className="card p-3">
                  <q className='page-heading fs-1 text-blue'>{value.title}</q>
                  <p className='text-center fs-5'>{value.description}</p>
                </div>
        </div>
        )
       })}
        </div>
        </div>
  ):null
}

export default Blogs
