import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';

const Navbar = () => {
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
}
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg bg-light px-2 ">
  <div className="d-flex flex-wrap justify-content-around w-100">
    <img srcSet="/images/org_cropped.webp" alt="not found" id="logo" />
    <Link className="navbar-brand title" to="/">Shoaib Academy</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      
      <ul className="navbar-nav mb-2 mb-lg-0 mx-auto">
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/#home" scroll={el => scrollWithOffset(el)}>Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about">About</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/#blogs" scroll={el => scrollWithOffset(el)}>Blogs</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/#footer" scroll={el => scrollWithOffset(el)}>Contact Us</Link>
        </li>

        <div className="dropdown d-inline my-auto">
  <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Login
  </button>
  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" to="/TeacherLogin">As Teacher</Link></li>
    <li><Link className="dropdown-item" to="/StudentLogin">As Stuent</Link></li>
  </ul>
</div>
          
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar
