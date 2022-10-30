import React ,{useState,useContext} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {UserContext} from '../UserContext';


const Navbar = () => {

    const userContext = useContext(UserContext);
    const navigate = useNavigate()

    const onLogOutClick = (e) => {
        e.preventDefault();
        userContext.dispatch({
            type:"logout"
        })
        // navigate("/")
        window.location.href = "/"
    }

    return(

        <nav className=" navbar navbarStyle navbar-expand-lg navbar-dark navbar-header">

            <div className="container-fluid">

            <NavLink className="navbar-brand" to="/">jafarpour Store</NavLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"?
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/dashboard">
                                <i className="fa fa-dashboard"></i>
                                Dashboard
                            </NavLink>
                        </li>
                    :

                        ''
                    }
                    {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"?

                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/">
                                <i className="fa fa-shopping-bag"></i>
                                Store
                            </NavLink>
                        </li>
                    :

                        ''
                    }

                    {userContext.user.isLoggedIn && userContext.user.currentUserRole === "admin"?
                    
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/products">
                                <i className="fa fa-shopping-bag"></i>
                                Products
                            </NavLink>
                        </li>
                    :

                        ''
                    }

                    {!userContext.user.isLoggedIn?
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login" activeclassname="active" exact={`${true}`}>
                            <i class="fa fa-sign-in" aria-hidden="true"></i>
                                Login
                            </NavLink>
                           
                        </li>
                    :

                        ''
                    }

                    {!userContext.user.isLoggedIn?
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/register">
                            <i class="fa fa-registered" aria-hidden="true"></i>
                                Register
                            </NavLink>
                        </li>
                    :

                        ''
                    }


                </ul>

                {userContext.user.isLoggedIn?
                        <div style={{marginRight: 100}}>
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa fa-user circle"></i>
                                        <span>{`hello ${userContext.user.currentUserName}`}</span>
                                    </NavLink>
                                    <ul className="dropdown-menu selected" aria-labelledby="navbarDropdown" style={{zIndex:"1001"}}>
                                        <li className="px-2">
                                            <NavLink className="dropdown-item selected" to="#" onClick={onLogOutClick}>
                                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                                                LogOut
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    :

                        ''
                }

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