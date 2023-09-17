import React from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <div className='banner text-light' id='home'>
      <div className="bannerText d-flex flex-column justify-content-center">
        <h3>A dynamic learning platform</h3>
        <h1>New Approach toward Skillful Society.</h1>
        <p className='fs-4'>Connecting, Teaching, Guiding, Advocating</p>
        <Link className="btn btn-light rounded" to='/about'>Learn More</Link>
      </div>
      <div className="bannerImage">
        <img srcSet="images/educationalBackground.jpg" alt="Educational background" className='' />
      </div>
    </div>
  )
}

export default Banner
