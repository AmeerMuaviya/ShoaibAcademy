import React from "react";
import Navbar from "../Navbar";
import Footer from '../Footer'
const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: "20vw", margin: "auto" }}>
          <img src={`/images/org_cropped.webp`} alt="" />
        </div>
        <h1 className="page-heading text-center">About us</h1>
        <div className="home-features-container my-4">
          <h1 className="home-feature-heading Fondamento">Introduction</h1>
          <p className="fs-4">
            Shoaib Academy of commerce and sciences was Established in 2010 in
            Harbanspura Lahore. It was the first academy in the area with a
            place for every age of the students. This institution has three
            sections. Primary, secondary, and higher secondary. Shoaib academy
            has subject specialist teachers for every class and also has trained
            teachers for the primary classes. Recreational activities like trips
            and an annual prize distribution ceremony are also arranged yearly
            for the students. Nowadays, It is the fastest-growing institute in
            the area and imparts quality education.
          </p>
        </div>

        {data.map((value, index) => (
          <div
            key={index}
            className={`home-features-container my-4 home-features-container-${
              index % 2
            }`}
          >
            <div style={{ overflow: "hidden" }}>
              <h1 className="home-feature-heading Fondamento">
                {value.heading}
              </h1>
              <p className="">{value.details}</p>
            </div>
            <img src={`/images/${value.imageUrl}.webp`} alt="" />
          </div>
        ))}
        <div className="d-flex justify-content-center flex-column align-items-center">
          <h1 className="page-heading Fondamento" style={{fontSize:'50px'}}>Our Moto:</h1>
          <ol>
            <li className="fs-2">Commitment to learning</li>
            <li className="fs-2">Respect for self and all</li>
            <li className="fs-2">Excellence in all aspects.</li>
            <li className="fs-2">Accepting Responsibility</li>
          </ol>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default About;

let data = [
  {
    heading: "Vision: ",
    details:
      "The fundamental purpose of the academy is to make students educated and skilful to serve society and work for the betterment of their country. Our fee structure is flexible and economical, and concessions are also given to needy students because our primary purpose is imparting education.",
    imageUrl: "about-1",
  },
  {
    heading: "Teaching Methodology:",
    details:
      " We believe teachers and their teaching skills can make a dull or weak student a bright star. They just need motivation, guidance, and some extra effort. Our qualified teachers use various pedagogical skills to brighten up the minds of students and make them ready to achieve their high goals. It is the only institute in the area that is famous for its teaching methodologies. ",
    imageUrl: "about-2",
  },
  {
    heading: "Special focus",
    details:
      "There is a space for intelligent, average, or weak students. Intelligent students are motivated through prizes or appreciation to do better, and weak students are served with extra notes to make a pace with the high achievers. Teachers pay more attention to weak students and help them in learning. Extra teaching hours and weekend classes are arranged for students who need more effort to achieve goals. Shoiab academy is working hard to craft a better future for students through education.",
    imageUrl: "about-3",
  },
  {
    heading: "Moral Values:",
    details:
      "We have a very ambitious and hardworking staff that pays full attention to improving the moral and ethical values of the students. Morality and ethics are crucial in education to make students respectful citizens of the country. Training sessions are arranged for this purpose, the students are given lectures on ethics, and their training is done by our qualified staff.",
    imageUrl: "about-4",
  },
];
