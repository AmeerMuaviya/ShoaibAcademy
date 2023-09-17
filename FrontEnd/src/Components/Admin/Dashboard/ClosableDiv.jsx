import React,{useState,useEffect} from 'react'

const ClosableDiv = ({content}) => {
  const [show, setShow] = useState('d-block')
  useEffect(() => {
    setTimeout(() => {
     setShow('d-none')
    }, 100000);
  }, [])
  
  return (
    <div className={`position-absolute shadow-lg p-2  bg-light rounded ${show}`} style={{top:'10px',right:0,zIndex:999999,width:'300px',height:'300px',overflowY:'scroll'}}>
        <button className="btn-close sticky-top" onClick={()=>setShow('d-none')}></button>
        {content}
    </div>
  )
}

export default ClosableDiv