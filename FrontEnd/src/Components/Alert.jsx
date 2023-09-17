import React from 'react'
import './Css/Alert.css'

const Alert = (props) => {
  const showAletAcordingToType=(type,message)=>{
    switch (type) {
      case 'success':
        return (
        <div className="alert alert-success d-flex align-items-center" role="alert">
        <div>
        <i className="bi bi-check-circle-fill text-success"></i> {message}
        </div>
      </div>
      )
    case 'warning':
          return (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
          <div>
          <i className="bi bi-exclamation-triangle-fill text-warning"></i> {message}
          </div>
        </div>
        )
    case 'danger':
      return (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <div>
          <i className="bi bi-x-octagon-fill text-dagner"></i> {message}
          </div>
        </div>  
        )
      default:
        break;
    }
  }
  return (
    <>
    {props.alert && showAletAcordingToType(props.alert.type,props.alert.msg)}
    </>
  )
}

export default Alert