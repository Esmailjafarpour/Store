import React ,{useState,useContext,useEffect} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {UserContext} from '../../UserContext';
import {OrdersService,ProductService,GetUser} from '../../Service.js';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MailIcon from '@mui/icons-material/Mail';
import ProductOrderRegistration from '../ProductOrderRegistration';
import "./style.css";


const Navbar = () => {

    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [allState, setAllState] = useState({
            totalNumberOfOrders : [] ,
            orders : [],
            products : [],
            showOrder :false,
            // quantityInStock : product.quantityInStock,
            currentUser : [],
            orderQuantity : 0,
            numberOfOrder : 0
    });
    

    const onLogOutClick = (e) => {
        e.preventDefault();
        userContext.dispatch({
            type:"logout"
        })
        
        // navigate("/")
        window.location.href = "/"
    }

    useEffect(() => {

        (async ()=>{

            const usersResponse = await GetUser.fetchUser();
            const usersResponseBody = await usersResponse.json();

            const fetchProducts = await ProductService.fetchProducts();
            const fetchProductsResponseBody = await fetchProducts.json();
           
            if (userContext.user.currentUserName){

                let user = await usersResponseBody.filter((user) => (
                    user.id === userContext.user.currentUserId
                ))

                // let usercurrent = fetchUserResponseBody.filter(user => (
                //     user.fullName === userContext.user.currentUserName
                // ))

                let orderUser = usersResponseBody.find(user => user.fullName === userContext.user.currentUserName)
                let num = 0
                orderUser.orders.map(order =>(
                    num+=order.quantity
                ))
                setAllState((prev)=>({
                        ...prev,
                        totalNumberOfOrders : num,
                        numberOfOrder : orderUser.orders.length,
                        orders : orderUser.orders,
                        products : fetchProductsResponseBody,
                        currentUser : user[0],
                        showOrder : userContext.user.hideShoppingCart

                }))

            }
        }
        )()
   
    }, [
        userContext.user.totalOfOrders,
        userContext.user.currentUserName,
        allState.numberOfOrder,
        userContext.user.hideShoppingCart,
        userContext.user.changeProduct
    ]);


    let AddOrder = (Number)=>{

        setAllState(prev=>({
            ...prev,
            quantityInStock : --allState.quantityInStock,
            orderQuantity : ++allState.orderQuantity
        }))
        
        userContext.dispatch({
            type:"login",
            payload:{
                isLoggedIn : userContext.user.isLoggedIn,
                currentUserId : userContext.user.currentUserId,
                currentUserName : userContext.user.currentUserName,
                currentUserRole : userContext.user.currentUserRole,
                imageUser: userContext.user.imageUser,
                totalOfOrders: userContext.user.totalOfOrders,
                hideShoppingCart : true,
                changeProduct : !userContext.user.changeProduct
            },
            
        })
        console.log(userContext.user.changeProduct)

        // totalOrders("add",++allState.orderQuantity)
    }

    let OrderReduction = (Number)=>{
        setAllState(prev=>({
            ...prev,
            quantityInStock : ++allState.quantityInStock,
            orderQuantity :  --allState.orderQuantity
        }))

        userContext.dispatch({
            type:"login",
            payload:{
                isLoggedIn : userContext.user.isLoggedIn,
                currentUserId : userContext.user.currentUserId,
                currentUserName : userContext.user.currentUserName,
                currentUserRole : userContext.user.currentUserRole,
                imageUser: userContext.user.imageUser,
                totalOfOrders: userContext.user.totalOfOrders,
                hideShoppingCart : true,
                changeProduct : !userContext.user.changeProduct
            },
            
        })
        // totalOrders("dec",--allState.orderQuantity)
    }
       


    return(

        <nav className="navbar navbarStyle navbar-expand-lg navbar-dark navbar-header
            border-[1px] border-stone-600 rounded-lg bg-stone-900">
            <Box className="container-fluid grid grid-cols-12">
                <NavLink className="navbar-brand col-span-2" to="/">jafarpour Store</NavLink>

                <Button 
                    className="navbar-toggler col-span-2" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </Button>

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

                    {allState.numberOfOrder && userContext.user.currentUserName ?
                        <Box 
                            className="relative"
                            // onBlur={() => (
                            //     setAllState(prev => ({
                            //         ...prev,
                            //        showOrder : false
                            //     }))
                            // )
                                
                            // }
                        >
                            <button type="button" className="numberShoppingCart text-green-300 border-2 border-neutral-600
                                    focus:outline-none rounded-lg text-sm px-1 text-center bg-gradient
                                    mr-2 mb-1 dark:hover:text-green-900 dark:hover:bg-green-200 rounded-full px-2 py-2"
                                    onClick={()=> 
                                        setAllState(prev => ({
                                        ...prev,
                                        showOrder : !allState.showOrder
                                    }))
                                }
                            
                            >
                                <NavLink className="nav-link text-green-600" activeclassname="active" aria-current="page">
                                    <i className="fa fa-shopping-cart relative fa-lg">
                                        <span className="text-base absolute -top-5 -right-5 bg-purple-800 text-gray-50 px-1 px-2 py-1 text-xs rounded-full">
                                            {allState.totalNumberOfOrders}
                                        </span>
                                    </i>
                                </NavLink>
                            </button>
                            
                            {allState.numberOfOrder && allState.showOrder?

                                <Box className ="absolute top-[45px] right-[45px]">
                                    
                                    <Box 
                                        className="shoppingCard border-2 border-neutral-600 bg-stone-900 rounded-lg w-fit"
                                    >
                                        <ul className="px-0.5 w-72">
                                            {allState.orders.map(order => (
                                                <li className="border-2 border-neutral-600  px-2 py-2 mx-1.5 my-1.5 rounded-lg  cursor-pointer">
                                                    <Box className="d-flex justify-between">
                                                        <span className="mx-1.5 my-1.5 text-[12px]">{order.productName}</span>
                                                        <img className="rounded-lg w-20" src={require(`../../images/${order.imageProduct}`)} alt="" /> 
                                                    </Box>
                                                    <Box className="w-[100px] m-auto">
                                                        <ProductOrderRegistration
                                                            product={allState.products.filter(product => product.id === order.id)[0]}
                                                            orderQuantity={order.quantity}
                                                            AddOrder={AddOrder}
                                                            OrderReduction={OrderReduction}
                                                            hiddenAddToCard={true}
                                                            // onCheckLogin={onCheckLogin}
                                                            // currentUser={allState.currentUser}
                                                        />
                                                    </Box>
                                                </li>
                                            ))}

                                        </ul>
                                    </Box>

                                    <Box type="button" className="w-[140px] h-[55px] m-auto mt-2 bg-neutral-50 text-green-300 border-2 border-neutral-600
                                        focus:outline-none rounded-lg text-sm px-1 text-center bg-gradient
                                        mr-2 mb-1 dark:hover:text-green-900 dark:hover:bg-green-200 rounded-full px-2 py-2"
                                        onClick={()=> setAllState(prev => ({
                                            ...prev,
                                            showOrder : !allState.showOrder
                                        }))}

                                    >
                                        <NavLink className="nav-link text-green-600 mx-auto d-flex justify-between" activeclassname="active" aria-current="page" to="/dashboard">
                                            <img src={require('../../images/all.png')} className="w-[40px] h-[40px] m-auto fa fa-shopping-basket text-green-700 my-auto mx-0 " aria-hidden="true"/>
                                            <i className="w-[30px] h-[30px] m-1 border-2 border-green-800 rounded-full text-violet-700 p-[2px]">{allState.numberOfOrder}</i>
                                        </NavLink>
                                    </Box>

                                </Box>

                                  :  

                                  "" 
                            } 
                           
                        </Box>
                         
                    :""}

                    {userContext.user.isLoggedIn?
                            <Box className="flex justify-center items-center" style={{marginRight: 10}}>
                                <NavLink className="flex justify-center no-underline mr-2" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {/* <i className="fa fa-user circle text-yellow-400"></i> */}
                                    <Box className=" flex justify-center items-center mr-2">
                                        <span className="text-yellow-500 m-1">Hello</span>
                                        {<span className="text-green-300">{userContext.user.currentUserName}</span>}
                                    </Box>
                                    <Box className="relative">
                                        <img class="object-cover w-8 h-8 rounded-full border-[2px] border-stone-500 p-1" src={require(`../../images/${userContext.user.imageUser}`)}/>
                                    </Box>
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