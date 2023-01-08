import React ,{useState,useContext} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {UserContext} from '../../UserContext';
import Box from '@mui/material/Box';
import "./navbar.css";


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

        <nav className="navbar navbarStyle navbar-expand-lg navbar-dark navbar-header
            border-[1px] border-stone-600 rounded-lg bg-stone-900">
            <Box className="container-fluid grid grid-cols-12">
                <NavLink className="navbar-brand col-span-2" to="/">jafarpour Store</NavLink>

                <button className="navbar-toggler col-span-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <Box className="collapse navbar-collapse flex" id="navbarSupportedContent">
                    <ul className="grid grid-cols-4 gap-4 me-auto mb-2 mb-lg-0">
                        
                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"?
                            <li className="col-span-2">
                                <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/dashboard">
                                    <i className="fa fa-dashboard"></i>
                                    Dashboard
                                </NavLink>
                            </li>
                        :''}

                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user"?

                            <li className="col-span-2">
                                <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/">
                                    <i className="fa fa-shopping-bag"></i>
                                    Store
                                </NavLink>
                            </li>
                        :''}

                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "admin"?
                        
                            <li className="col-span-2">
                                <NavLink className="nav-link" activeclassname="active" aria-current="page" to="/products">
                                    <i className="fa fa-shopping-bag"></i>
                                    Products
                                </NavLink>
                            </li>
                        :''}

                        {!userContext.user.isLoggedIn?
                            <li className="col-span-2">
                                <NavLink className="nav-link" to="/login" activeclassname="active" exact={`${true}`}>
                                <i className="fa fa-sign-in" aria-hidden="true"></i>
                                    Login
                                </NavLink>
                            
                            </li>
                        :''}

                        {!userContext.user.isLoggedIn?
                            <li className="col-span-2">
                                <NavLink className="nav-link" activeclassname="active" to="/register">
                                <i className="fa fa-registered" aria-hidden="true"></i>
                                    Register
                                </NavLink>
                            </li>
                        :''}

                    </ul>

                    {userContext.user.orderNumber?
                         <button type="button" className="numberShoppingCart text-green-300 border-2 border-neutral-600
                            focus:outline-none rounded-lg text-sm px-1 text-center bg-gradient
                            mr-2 mb-1 dark:hover:text-green-900 dark:hover:bg-green-200 rounded-full px-2 py-2">
                           <NavLink className="nav-link text-green-600" activeclassname="active" aria-current="page" to="/dashboard">
                            <i className="fa fa-shopping-cart relative fa-lg">
                                <span className="text-base absolute -top-5 -right-5 bg-purple-800 text-gray-50 px-1 px-2 py-1 text-xs rounded-full">{userContext.user.orderNumber}</span>
                            </i>
                            
                           </NavLink>
                       </button>
                    :""}

                    {userContext.user.isLoggedIn?
                            <Box className="flex justify-center items-center" style={{marginRight: 10}}>
                                <NavLink className="flex justify-center no-underline mr-2" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {/* <i className="fa fa-user circle text-yellow-400"></i> */}
                                    <Box className=" flex justify-center items-center mr-2">
                                        <span className="text-yellow-500 m-1">Hello</span>
                                        {<span className="text-green-300">{userContext.user.currentUserName}</span>}
                                    </Box>
                                    <img class="object-cover w-8 h-8 rounded-full border-[2px] border-stone-500 p-1" src={require(`../../images/${userContext.user.imageUser}`)}/>
                                </NavLink>
                                <NavLink className=" selected w-24 h-10 p-2 rounded-lg no-underline" to="#" onClick={onLogOutClick}>
                                            LogOut
                                        <i className="fa fa-sign-out mx-1" aria-hidden="true"></i>
                                </NavLink>
                            </Box>
                        :''}

                       
                    {/* <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form> */}
                </Box>
            </Box>
        </nav> 
    )
}

export default Navbar;