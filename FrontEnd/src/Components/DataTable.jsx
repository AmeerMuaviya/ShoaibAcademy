import React, { useState, useEffect,useContext } from "react";
import { generalContext } from "../contexts/generalContext";
const Table = ({ arrayOfObjects, keysToDisplay ,onChange,selectedStudents,heading,state}) => {
  const [searchTerm, setSearchTerm] = useState({});

const {capitallizeFirstLetter,classes} =useContext(generalContext)
    let _classes=classes.map((value) => value.className)
  useEffect(() => {
    if(selectedStudents)
    onChange([]);
    //eslint-disable-next-line
  }, [arrayOfObjects,onChange]);
  useEffect(() => {
    if(state) setSearchTerm({})
  }, [state])
 
  const handleSelect = (id) => {
    if(!selectedStudents) return
    if (selectedStudents.includes(id)) {
      onChange(selectedStudents.filter((selectedId) => selectedId !== id));

    } else {
      onChange([...selectedStudents, id]);
    }
  };

  const handleSelectAll = (e) => {
    if(!selectedStudents) return
    onChange(
      !e.target.checked
        ? []
        : filteredArrayOfObjects.map((obj) => obj.uid)
    );
  };
  const handleSearch = (key, value) => {
    setSearchTerm({ ...searchTerm, [key]: value });
  };
  
  const filteredArrayOfObjects = arrayOfObjects.filter((obj) => {
    return Object.entries(searchTerm).every(([key, value]) => {
      if(key==='class' && value!=='')
      return obj[key]===value;
      return obj[key].toString().toLowerCase().includes(value.toLowerCase());
    });
  });
  return (
    <div className="shadow-lg p-2 border w-max mx-auto">
    <h4 className="page-heading">{heading}</h4>
    <div>
    <table className="table table-primary">
      <thead className="position-relative">
        <tr>
          <th>
            {selectedStudents && <input type="checkbox" onChange={handleSelectAll} checked={selectedStudents.length===filteredArrayOfObjects.length && selectedStudents.length>=1}/>}
          </th>
          {keysToDisplay.map((key,index) => (
            <th key={key+index} className='text-center px-0'>
              {capitallizeFirstLetter(key)}{" "}
              <div>
             {key==='class'?
             <select className="form-control fs-4 rounded w-100 py-2 bg-light" style={{minWidth:'200px'}} onChange={(event) => handleSearch(key, event.target.value)} value={searchTerm.key}>
              <option value={''}>Search by class</option>
                {_classes.length && _classes.map((value,index) => (
                  <option key={index}>{value}</option>
                ))}
             </select>:
              <input
                type="text"
                className="rounded w-75"
                onChange={(event) => handleSearch(key, event.target.value)}
                defaultValue={searchTerm.key}
                placeholder={`Search by ${key}`}
                />}
                </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredArrayOfObjects.map((obj) => (
          <tr key={obj.id}>
            <td>
              {selectedStudents && <input
                type="checkbox"
                checked={selectedStudents.includes(obj.uid)}
                onChange={() => handleSelect(obj.uid)}
                />}
            </td>
            {keysToDisplay.map((key) => (
              <td key={key}>{obj[key]}</td>
            ))}
          </tr>
        ))}
        {!filteredArrayOfObjects.length && <tr><td className="fs-2 text-secondary text-center" colSpan={keysToDisplay.length+1}>Nothing to show!</td></tr>}
      </tbody>
    </table>
    </div>
                </div>
  );
};

export default Table;
