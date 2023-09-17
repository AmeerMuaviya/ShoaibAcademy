import React from "react";

const Classes = () => {
  return (
    <div className="classes">
      <h1 className="fw-bolder text-center">Teaching methodology</h1>
      <div id="AllCards">
        {/*  Card starts here */}
        <div className="classCard">
          <div className="cardImg">
            <img srcSet="images/class-1.webp" alt="not found" />
          </div>
          <div className="cardBody">
            <h3 className="text-center">Logic Building</h3>
            <span className="text-center">
              We believe that logic building is an essential component of a
              well-rounded education, and we have designed our programs to help
              students develop these skills.We prioritize logic building in our
              educational approach and provide students with the resources and
              tools they need to develop critical thinking skills. we help
              students develop their logic building skills, with a focus on
              problem-solving and decision-making.
            </span>
          </div>
        </div>
        {/* card ends here */}
        {/*  Card starts here */}
        <div className="classCard">
          <div className="cardImg">
            <img srcSet="images/class-2.webp" alt="not found" />
          </div>
          <div className="cardBody">
            <h3 className="text-center">Project Based Learning</h3>
            <span className="text-center">
              Project-based learning is an educational approach that emphasizes
              student-led inquiry and problem-solving. Rather than simply
              learning information from a textbook or lecture, students engage
              in projects that require them to investigate and explore
              real-world problems. At our organization, we believe that
              project-based learning is a powerful tool for helping students
              develop the skills they need to succeed in the 21st century.
            </span>
          </div>
        </div>
        {/* card ends here */}
        {/*  Card starts here */}
        <div className="classCard">
          <div className="cardImg">
            <img srcSet="images/class-3.webp" alt="not found" />
          </div>
          <div className="cardBody">
            <h3 className="text-center">Group Study</h3>
            <span className="text-center">
              Group study is a popular and effective method of learning that
              involves collaborating with peers to review course materials,
              prepare for exams, and complete assignments.We provide various
              resources to facilitate group study, such as study spaces and
              access to tutoring and academic support services. Our faculty also
              encourage and support group study by assigning group projects and
              providing guidance and feedback.
            </span>
          </div>
        </div>
        {/* card ends here */}
      </div>
    </div>
  );
};

export default Classes;
