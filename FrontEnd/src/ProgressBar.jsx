import React, { useContext } from 'react'
import LoadingBar from 'react-top-loading-bar'
import { generalContext } from './contexts/generalContext'

const ProgressBar = ({value}) => {
const {setProgress}=useContext(generalContext)

  return (
    <div>
      <LoadingBar
        color='red'
        progress={value}
        height='3px'
        transitionTime={300}
        shadow='true'
        waitingTime={1000}
        onLoaderFinished={()=>setProgress(0)}
      />

    </div>
  )
}

export default ProgressBar