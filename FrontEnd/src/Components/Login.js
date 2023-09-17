import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { generalContext } from "../contexts/generalContext";
import Navbar from "./Navbar";
const Login = (props) => {
  const { showAlert, setProgress } = useContext(generalContext);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate(`/${user.status}`);
    //eslint-disable-next-line
  }, []);

  const [inputs, setInputs] = useState({ username: "", password: "" });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProgress(20);
      let userType = props.user;
      let res = await login(inputs, userType);
      setProgress(70);
      if (res) {
        navigate(`/${res.status}`);
        showAlert("success", "Congretulations! Successfully logged in");
      } else
        showAlert(
          "warning",
          "Failure! Please try again with correct credentials"
        );
    } catch (error) {
      if (error.response.status)
        showAlert(
          "danger",
          "Too many login attempts. Please try again after a few minutes"
        );
    }
    setProgress(100);
  };
  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-between align-items-center align-content-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="pictureSection">
          <img src="/images/teacher-background.webp" alt="TeaherPicture" />
        </div>
        <div className="formSection d-flex justify-content-center align-items-center mx-auto"
        style={{height:'70vh'}}
        >
          <div
            className="p-3 rounded shadow-lg"
            style={{ maxWidth: "420px", minHeight: "65vh"}}
          >
            <h2 className=" fs-Mochiy-Pop-One m-3">
              Please Login for further actions.
            </h2>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mx-4">
                <div class="form-floating mb-5">
                  <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    autoComplete="true"
                    placeholder="e.g Hamza"
                    class="form-control"
                    id="floatingInput"
                  />
                  <label for="floatingInput">Username</label>
                </div>
                <div class="form-floating mt-3">
                  <input
                    class="form-control"
                    id="floatingPassword"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    autoComplete="true"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Password</label>
                </div>
                <input
            type="submit"
              value="Login"
              style={{ width: "200px", height:"50px" }}
              className="btn btn-primary my-5 block-btn"
            />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
