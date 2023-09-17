import React, { useState, useEffect } from "react";

const DynamicSelect = ({ onChange, defaultValue, state,options }) => {
  let counter = 1;
  const [subjects, setSubjects] = useState(
    state === "update"
      ? Object.entries(defaultValue).map(([subject, input]) => ({
          id: counter++,
          subject,
          input,
        }))
      : [{ id: 1, subject: "", input: "" }]
  );
  
  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { id: subjects.length + 1, subject: "", input: "" },
    ]);
  };
  
  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };
  
  const handleSubjectChange = (id, value) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === id) {
          return { ...subject, subject: value, input: "" };
        }
        return subject;
      })
    );
  };

  const handleInputChange = (id, value) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === id) {
          return { ...subject, input: value };
        }
        return subject;
      })
    );
  };

  useEffect(() => {
    const data = {};
    subjects.forEach((value) => {
      data[value.subject] = value.input;
    });
    onChange(data);
    //eslint-disable-next-line
  }, [subjects]);
  return (
    <>
      <td>
        {subjects.map((subject,index) => (
          <div key={index} className='my-1 d-flex flex-wrap justify-content-between'>
            <select
            role="button"
            className="cursor-pointer form-control schedule-input"
              value={subject.subject}
              required
              onChange={(e) => handleSubjectChange(subject.id, e.target.value)}
            >
              <option value="">Select a subject</option>
              {options.map((value, index) => (<option key={index+value}>{value}</option>))}
            </select>
            {index!==0 && <button onClick={() => handleDeleteSubject(subject.id)} className='btn btn-warning bi bi-x-lg mx-1'></button>}
            <button onClick={handleAddSubject} className='btn btn-success bi bi-plus-lg mx-1'></button>
          </div>
        ))}
      </td>
      <td className="d-flex flex-column gap-3 flex-wrap border-0">
        {subjects.map((subject) => (
          <div key={subject.id}>
            <textarea
              type="text"
              className="form-control schedule-input"
              value={subject.input}
              placeholder={
                subject.subject
                  ? `Syllabus for ${subject.subject}`
                  : "Select a subject"
              }
              onChange={(e) => handleInputChange(subject.id, e.target.value)}
            ></textarea>
          </div>
        ))}
      </td>
    </>
  );
};

export default DynamicSelect;
