import React, { useState, useContext, useEffect } from "react";
import axios from "../../axiosInstance";
import { generalContext } from "../../contexts/generalContext";
import { AuthContext } from "../../contexts/authContext";
import DataTable from "../DataTable";
const UploadNotes = () => {
  let { showAlert } = useContext(generalContext);
  let { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  // const [file, setFile] = useState();
  const [inputs, setInputs] = useState({});

  function getStudents() {
    axios.get("/students/all").then((response) => {
      setStudents(response.data);
    });
  }

  useEffect(() => {
    getStudents();
  }, []);

  function upload(e) {
    e.preventDefault();
    if (!selectedStudents.length)
      return showAlert("warning", "Please select at least on student.");
    const formdata = new FormData();
    formdata.append("doc", inputs.doc);
    axios
      .post("/user/uploadNotes", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data) {
          let data = {
            title: inputs.title ? inputs.title : "New Material Added to Course",
            content: inputs.content
              ? inputs.content
              : `${user.fullName} just added notes for you. Navigate to Notes page from the sidebar to download your file.`,
            Auther: user.fullName,
            users: JSON.stringify(selectedStudents),
            views: JSON.stringify([]),
            db: "Students",
            link:'/Student/notes'
          };
          axios
            .post("/notes/add", {
              users: data.users,
              doc: response.data,
              description: data.content,
              Auther:data.Auther,
            })
            .then((response) => {
              if (!response.data.err)
                axios
                  .post("/notifications/addNotification", data)
                  .then((response) => {
                    if (!response.data.err)
                      showAlert("success", "Notes added successfully");
                    else showAlert("warning", response.data.msg);
                  });
              else showAlert("warning", response.data.msg);
            });
        } 
      });
  }
  function handleChange(e) {
    if (e.target.name === "doc") {
      setInputs({ ...inputs, [e.target.name]: e.target.files[0] });
    } else setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  return (
      <div className="container my-3">
        <h1 className="page-heading">Upload notes</h1>
      {students && (
            <DataTable
              heading={'Select students'}
              arrayOfObjects={students}
              selectedStudents={selectedStudents}
              onChange={setSelectedStudents}
              keysToDisplay={["username", "class", "gender"]}
            />
          )}
        <form className="mx-auto my-2 special-form" onSubmit={upload}>
          <input
            type="text"
            name="title"
            className="fs-5 w-100 p-2 rounded"
            placeholder="Why this document? (optional)"
            onChange={handleChange}
          />
          <textarea
            name="content"
            onChange={handleChange}
            className='fs-5 w-100 p-2 rounded'
            placeholder="What's in this document? (optional)"
          ></textarea>
          <input
            className="form-control form-control-lg mb-3 fs-5 w-100 p-2 rounded"
            name="doc"
            id="doc"
            type="file"
            onChange={handleChange}
            required
          />
          
          <button className="btn btn-light bi bi-plus-lg" type="submit"> Upload</button>
        </form>
      </div>
  );
};

export default UploadNotes;
