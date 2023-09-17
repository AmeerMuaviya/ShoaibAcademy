import React, { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
const Blogs = () => {
  const [inputs, setInputs] = useState({});
  const [blogs, setBlogs] = useState([]);
  const { showAlert } = useContext(generalContext);
  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    getBlogs();
  }, []);

  function getBlogs() {
    axios.get("/blogs/all").then((response) => {
      setBlogs(response.data.blogs);
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios.post("/blogs/add-blog", inputs).then((response) => {
      response.data.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
      getBlogs();
    });
  }
  function deleteBlog(id) {
    axios.delete(`/blogs/delete-blog/${id}`).then((response) => {
      response.data.err
        ? showAlert("warning", response.data.msg)
        : showAlert("success", response.data.msg);
    });
    getBlogs();
  } //d-flex gap-3 flex-wrap justify-content-center
  return (
    <div className="container my-3">
      <h1 className="page-heading">Add a new blog</h1>
      <form onSubmit={handleSubmit} className="stdform special-form mx-auto ">
        <input
          type="text"
          className="stdform-item"
          name="title"
          onChange={handleChange}
          placeholder="Enter title of the blog"
        />
        <textarea
          name="description"
          className="stdform-item"
          onChange={handleChange}
          placeholder="Enter Description of the blog"
        ></textarea>
        <input
          type="submit"
          value="Add a new blog now"
          className="btn btn-primary"
        />
      </form>
      {blogs && blogs.length ? <h1>All blogs/announcements</h1>:null}
      {!blogs || !blogs.length ? <h2 className="text-secondary text-center mt-5">Nothing to show</h2>:null}
      <div className="d-flex gap-3 flex-wrap justify-content-center align-items-center">
        {blogs &&
          blogs.length ?
          blogs.map((value, index) => (
            <div key={index} className="special-card mx-auto border p-2">
              <h2 className="mt-4">{value.title}</h2>
              <button
                className="btn btn-warning float-end"
                style={{ left: "77%", top: "0" }}
                onClick={() => deleteBlog(value.id)}
              >
                Delete
              </button>
              <p className="fs-5">{value.description}</p>
            </div>
          )):null}
      </div>
    </div>
  );
};

export default Blogs;
