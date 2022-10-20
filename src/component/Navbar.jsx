import React ,{useState} from 'react';
import {NavLink} from 'react-router-dom';

const Navbar = () => {

    return(

        <nav className="navbar navbarStyle navbar-expand-lg navbar-dark">

            <div className="container-fluid">

            <NavLink className="navbar-brand" to="/">jafarpour Store</NavLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    <li className="nav-item">
                        <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/dashboard">
                            <i className="fa fa-dashboard"></i>
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" activeclassname="active" exact={`${true}`}>Login</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" activeclassname="active" to="/register">Register</NavLink>
                    </li>

                </ul>

                <div style={{marginRight: 100}}>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa fa-user circle"></i>
                                User
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink className="dropdown-item" to="#">LogOut</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* <form className="d-flex">
                    
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    
                    <button className="btn btn-outline-success" type="submit">Search</button>

                </form> */}

            </div>

            </div>

        </nav> 
    )
}

export default Navbar;