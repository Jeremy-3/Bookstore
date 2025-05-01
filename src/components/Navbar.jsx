import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("session"))

   
    if (sessionData && sessionData.access_token){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  },[])

 const handleLogout = (e) => {
  e.preventDefault()
 
  try{
    const sessionData = JSON.parse(localStorage.getItem("session"))
     
    if(!sessionData){
      console.error("User is not logged in.")
      setIsLoggedIn(false);
      navigate("/login")
      return
    }
    localStorage.removeItem("session")
    setIsLoggedIn(false)
    navigate("/login")
  }catch(error){
    console.error("Error during logout:", error)
    alert("An error occurred during logout. Please try again.")
  }

 }
   
  

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <NavLink to="/home" className="logo">
             <img src="/book.png" alt="logo" />       
        </NavLink>

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
           {!isLoggedIn ? (
            <div className="buttons">
            <NavLink to='/signup' className="btn">
              Sign up
            </NavLink>
            <NavLink to='/login' className="btn">
              Login
            </NavLink>
          </div>
           ) : (
            <button className="buttons" onClick={handleLogout}>
              <NavLink className="btn" >Logout</NavLink>
            </button>
           )}
       
      </nav>
    </div>
  );
};

export default Navbar;
