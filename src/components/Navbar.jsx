import React from "react";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <a href="#" className="logo">
             <img src="/book.png" alt="logo" />       
        </a>

        <ul className="nav-links">
          <li className="active">
            <NavLink to="/home" className="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about ">About</NavLink>
          </li>
          <li>
            <NavLink to= "/contact">Contact us</NavLink>
          </li>
        </ul>
        <div className="buttons">
          <NavLink to='/signup' className="btn">
            Sign up
          </NavLink>
          <NavLink to='/login' className="btn">
            Login
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
