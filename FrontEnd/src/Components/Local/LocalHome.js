import React from 'react'
import Footer from '../Footer'
import Navbar from '../Navbar'
import Banner from './Banner'
import Blogs from './Blogs'
import Classes from './Classes'
import Facilities from './Facilities'
import Location from './Location'

const Home = () => {


  return (
    <>
    <Navbar/>
      <Banner/>
      <Facilities/>
      <Classes/>
      <Blogs/>
      <Location/>
      <Footer/>
    </>
  )
}

export default Home
