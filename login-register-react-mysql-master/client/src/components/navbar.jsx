import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ user,logged ,authenticated }) => {
  console.log("navbar",logged)
 console.log(authenticated,"is authenticared")
//  let isUserLoggedIn
  return (
    <div style={{ marginBottom: 15 }}>
      <nav className="nav nav-masthead justify-content-end">
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/">
            Home
          </NavLink>
        </li>
       


        {!authenticated && (
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
            </li>
          </React.Fragment>
        )}
          {authenticated && (
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
           
          </React.Fragment>
        )}
        {authenticated && (
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </li>
            
          </React.Fragment>
        )}
        {authenticated && (
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
              {user.username}
              </NavLink>
            </li>
            
          </React.Fragment>
        )}
        
      </nav>
    </div>
  );
};

export default NavBar;
