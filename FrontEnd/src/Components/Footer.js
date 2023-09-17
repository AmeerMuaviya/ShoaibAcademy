import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';
const Footer = () => {
    const scrollWithOffset = (el) => {
        const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -80; 
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
    }
  return (
    <>
    <footer className='text-white' id='footer'>
        <div className="socialLinks">
            <h2 className=' mx-4 fw-bolder '>Social Links</h2>
            <span className='d-block my-5 fs-4'>Shoaib Academy can be found on multiple social media channels. To stay up-to-date, follow and subscribe to our accounts for the latest updates.</span>
            <ul>
                <li><i className="bi bi-facebook"></i>Facebook</li>
                <li><i className="bi bi-whatsapp"></i>Whatsapp</li>
                <li><i className="bi bi-twitter"></i>Twitter</li>
                <li><i className="bi bi-instagram"></i>Instagram</li>
            </ul>
        </div>
        <div className="addressSection">
            <h2 className='mb-3'>Get in Touch</h2>
            <ul>
                <li><i className='bi bi-geo-alt'></i><h3 className='fw-bold d-inline'>Address</h3>
                <span className='d-block my-4 text-center'>Mian Mustaqim Park, Near Jamia Masjid Siddiq-e-Akbar Harbanspura, Lahore.</span></li>

                <li><i className="bi bi-envelope"></i><h3 className='fw-bold d-inline'>Email Address</h3>
                <span className='d-block my-4 text-center'>shoaibacademy@gmail.com</span></li>


                <li><i className="bi bi-telephone"></i><h3 className='fw-bold d-inline'>Phone Number</h3>
                <span className='d-block my-4 text-center'>0322-8024845</span></li>
            </ul>
        </div>
        <div className="quickLinksSection">
            <h2 className='mb-3'>Quick Links</h2>
            <ul>
                <li>
                    <Link className='text-white' to="/#home"scroll={el => scrollWithOffset(el)}> <i className="text-white bi bi-caret-right-fill"></i> Home</Link>
                    </li>
                <li>
                    <Link className='text-white' to="/about"> <i className="text-white bi bi-caret-right-fill"></i> About</Link>
                    </li>
                <li>
                    <Link className='text-white' to="/#blogs" scroll={el => scrollWithOffset(el)}> <i className="text-white bi bi-caret-right-fill"></i> Blogs
                    </Link>
                    </li>
                <li>
                <div className="dropdown d-inline my-auto">
  <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Login
  </button>
  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" to="/TeacherLogin">As Teacher</Link></li>
    <li><Link className="dropdown-item" to="/StudentLogin">As Stuent</Link></li>
  </ul>
</div>
                    </li>
            </ul>
        </div>
    </footer>
        <div id='copyright' className='d-flex justify-content-center align-items-center'>
            <h3 className='text-white'>&copy;Copyright@Shoaib Academy.com. All rights are reserved.</h3> </div>
        </>
  )
}

export default Footer
