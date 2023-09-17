import React from 'react'
import useFetchSubjects from '../useFetchSubjects'

const SubjectsModal = ({selectedSubjects}) => {
  let subjects=useFetchSubjects();
  return (
    <div>
        {subjects.map((value, index) => {
            return <>
                <input key={index} type="checkbox" checked={selectedSubjects.includes(value)}/>
            </>
        })}
    </div>
  )
}

export default SubjectsModal