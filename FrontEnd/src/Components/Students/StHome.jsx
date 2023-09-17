import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import "../Css/StHome.scss";
import Blogs from "../Local/Blogs";
import obj from "../Quotes";
import { Link } from "react-router-dom";

const StHome = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <div className="st-first-section position-relative">
        <div
          className="bg-white p-2 rounded"
          style={{ position: "absolute", top: "1rem", right: "5px" }}
        >
            <span className="text-dark text-large">
              Fee status &nbsp; &nbsp;
            </span>
            <span
              className={
                user.feeStatus === "Unpaid" ? "text-danger" : "text-success"
              }
            >
              • {user.feeStatus}
            </span>
        </div>
        <h1>
          {" "}
          <span className="Marker"> Welcome Dear </span>
          <br />
          <span className="special-text Fugaz" style={{ fontSize: "5.9rem" }}>
            {user.fullName}
            <br />
          </span>
        </h1>
        <p className="Kanit">"Quote of the day: {obj.Student.quote}"</p>
        <div className="d-flex flex-row flex-wrap justify-content-center items-center gap-3 w-50">
          <Link
            to={"/Student/schedules"}
            className="btn btn-primary "
            style={{ minWidth: "180px" }}
          >
            Schedules
          </Link>
          <Link
            to={"/Student/notes"}
            style={{ minWidth: "180px" }}
            className="btn btn-primary "
          >
            Notes
          </Link>
        </div>
      </div>
      <div>
        <Blogs />
        <h1 className="page-heading text-center text-white rounded Marker bg-primary">
          Important tips and tricks
        </h1>
        <div className="st-cards-section">
          {content.map((value, index) => (
            <div key={index} className="card p-3">
              <q className="page-heading fs-1 fw-bold text-blue">
                {value.title}
              </q>
              <p className="text-center fs-4">{value.desc}</p>
              <h2>Tips</h2>
              <ol>
                {value.tips.map((value, index) => (
                  <li key={value + index}>{value}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StHome;

let content = [
  {
    title: "The Value of Education",
    desc: "Education is critical for personal and professional growth. It provides a foundation for understanding the world and contributes to one's ability to make informed decisions.",
    tips: [
      "Consider the benefits of education, such as expanded career opportunities, higher earnings potential",
      "Reflect on your personal goals and aspirations and how education can help you achieve them.",
      "Explore various academic fields and discover what interests you.",
    ],
  },
  {
    title: "The Power of Inquiry",
    desc: "Research plays a vital role in advancing knowledge and understanding in every field of study. It enables us to explore new ideas and test theories.",
    tips: [
      "Consider the value of research in your chosen field of study and how it can impact the world.",
      "Learn about the research process and develop skills in data analysis and critical thinking.",
      "Seek out opportunities to participate in research projects or collaborate with faculty on research endeavors.",
    ],
  },
  {
    title: "Maximizing Your Learning Potential",
    desc: "Learning is a continuous process, and it's important to find ways to make the most of your study time.",
    tips: [
      "Create a comfortable and quiet study environment that is free from distractions.",
      "Use a variety of learning strategies, such as reading, taking notes, and participating in group discussions.",
      "Employ study techniques that work best for you, such as visual aids, mnemonic devices, or active learning strategies.",
    ],
  },
  {
    title: "Strategies for Academic Success",
    desc: " Academic success is influenced by a variety of factors, including study habits, time management, and goal setting.",
    tips: [
      "Develop a daily schedule that allows time for studying, attending classes, and extracurricular activities.",
      "Set specific, achievable goals for each academic term or semester.",
      "Develop effective study habits, such as taking breaks, reviewing material regularly, and seeking help when needed.",
    ],
  },
  {
    title: "The Power of Motivation",
    desc: "Motivation is a key driver of success in academic and personal pursuits. Finding ways to stay motivated can be challenging, but it's essential for achieving your goals.",
    tips: [
      "Reflect on your personal goals and aspirations and how education can help you achieve them.",
      "Use positive affirmations and self-talk to overcome negative self-doubt or anxiety.",
      "Surround yourself with supportive friends and family who encourage and inspire you.",
    ],
  },
];
