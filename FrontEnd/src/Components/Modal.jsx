import React from 'react'

const Modal = ({title='Title here',onSave,cancelOnly,body,modalId,modalType='modal-dialog',onSaveText='Save Changes',onSaveType='btn btn-primary'}) => {
  return (
    <div>
<div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className={modalType}>
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {body}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        {!cancelOnly&&<button type="button" data-bs-dismiss="modal" className={onSaveType} onClick={onSave}>{onSaveText}</button>}
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default Modal
