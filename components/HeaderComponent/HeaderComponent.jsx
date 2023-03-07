import React from 'react';
import './headerComponent.scss';

import arrow from '../../public/images/arrow.png';

export default function HeaderComponent() {



  return (
    <nav id="navbar">
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">News</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Our Team</a></li>
        <li><a href="#">Make Enquiry</a></li>
      </ul>
      <button className="contact-btn">Contact us <img src={`${arrow}`} alt="next-icon"></img></button>
      <div className="burger-menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>

  )
}