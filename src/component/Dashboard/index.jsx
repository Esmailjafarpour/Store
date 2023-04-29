import React , {useState,useEffect,useContext,useCallback} from 'react';
import {UserContext} from '../../UserContext.js';
import Order from '../../component/Order';
import {OrdersService,ProductService,GetUser} from '../../Service.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import "./style.css";

const Dashboard = () => {

    const [orders,setOrders] = useState([]);
    const userContext = useContext(UserContext);
    const [showOrderDeleteAlert, setShowOrderDeleteAlert] = useState(false);
    const [showOrderUpdateAlert, setShowOrderUpdateAlert] = useState(false);
    const [expanded, setExpanded] = React.useState('panel1');
    const [changeProduct, setChangeProduct] = React.useState(false);
    const [user, setUser] = React.useState(false);
    const [alert, setAlert] = React.useState(false);


    // const getPreviousOrders = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === true)  
    // }
    // const getCard = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === false)
    // }
    //fetch data from orders array of database
    //(async () => {})() - anonymous function


    // Get information about all orders
    const loadDataFromDataBase = useCallback(async()=>{

        // get all data from orders

        let usersResponse = await GetUser.fetchUser();

        if(usersResponse.ok){

            // get all data from product

            let usersResponseBody = await usersResponse.json();

            let user = await usersResponseBody.filter((user) => (

                user.id === userContext.user.currentUserId

            ))

            setUser(user[0])

            const orderResponseUser = user[0].orders

            // let orderResponseBody = await orderResponse.json();
            let productsResponse = await ProductService.fetchProducts();

            if (productsResponse.ok) {

                let productsResponseBody = await productsResponse.json();
                // Find the ordered product from all available products
                orderResponseUser.filter((order) => {
                    order.product = ProductService.getProductByProductId(productsResponseBody,order.productId)
                });
            }

            setOrders(orderResponseUser)

        }

    },[userContext.user.currentUserId])  
    

    useEffect(() => {
        document.title = 'Dashboard';
        loadDataFromDataBase();

    },[userContext.user.currentUserId,loadDataFromDataBase,changeProduct]);

    // Add the order to the orders for which the fees have been paid
    const onBuyNowClick = useCallback(async(orderId,userId,productId,quantity,imageProduct) => {

        // Updating an already ordered product or adding a new order to orders that have been confirmed and paid for
        if (window.confirm("Do you want to place order for this product?")) {
            let updateOrder = {
                id: orderId,
                userId: userId,
                productId: productId,
                quantity: quantity,
                imageProduct:imageProduct,
                isPaymentCompleted: true,
                
            }
            
            let userResponse = await fetch(`http://localhost:5000/users/${userId}`,{method:"GET"})
            
            if(userResponse.ok) {
                let userResponseBody = await userResponse.json()
                userResponseBody.orders.map(order => {
                    if(order.productId === orderId){
                        order.isPaymentCompleted = true
                    }
                })

                let paymentUpdateResponse = await fetch(`http://localhost:5000/users/${userId}`,{
                    method:"PUT",
                    body:JSON.stringify(userResponseBody),
                    headers:{"Content-type":"application/json"}
                })

                if(paymentUpdateResponse.ok){
                    let paymentUpdateResponseBody = await paymentUpdateResponse.json()
                    loadDataFromDataBase();
                    setShowOrderUpdateAlert(true)
                }

            }

            setTimeout(() => {
                setShowOrderUpdateAlert(false)
            }, 2000);
                    
        }

    },[loadDataFromDataBase])

    // Delete order
    const onDeleteClick = useCallback(async(orderId,userId)=>{
        if (window.confirm("Are you sure to delete this item from card?")) {
            let userResponse = await fetch(`http://localhost:5000/users/${userId}`,{method:"GET"})
            
            if(userResponse.ok) {
                let userResponseBody = await userResponse.json()
                let orderResponseBody = userResponseBody.orders.filter(order => (
                        order.id !== orderId    
                    )      
                )

                let user = {
                    email: userResponseBody.email,
                    password: userResponseBody.password,
                    fullName: userResponseBody.fullName,
                    dateOfBrith: userResponseBody.dateOfBrith,
                    gender: userResponseBody.gender,
                    country: userResponseBody.country,
                    recieveNewsLetters: userResponseBody.recieveNewsLetters,
                    role: userResponseBody.role,
                    imageUser: userResponseBody.imageUser,
                    id: userResponseBody.id,
                    orders : orderResponseBody
                }
                
              

                let paymentUpdateResponse = await fetch(`http://localhost:5000/users/${userId}`,{
                    method:"PUT",
                    body:JSON.stringify(user),
                    headers:{"Content-type":"application/json"}
                })

                if(paymentUpdateResponse.ok){
                    let paymentUpdateResponseBody = await paymentUpdateResponse.json()
                    // console.log("paymentUpdateResponseBody",paymentUpdateResponseBody)
                    loadDataFromDataBase();
                    setShowOrderDeleteAlert(true)
                }

                // if (orderResponse.ok) {
                //     let orderReponseBody = await orderResponse.json();
                //     loadDataFromDataBase();
                //     setShowOrderDeleteAlert(true)
                // }
            }
        }
    },[loadDataFromDataBase])


    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const changeProducted=()=>{
        setChangeProduct(!changeProduct)
    }

    return(
        
        <Box className="">
            {/* <Box className="grid grid-cols py-1 border-stone-700 title-order header-dashboard title ">
                <Typography className="flex justify-between py-2 m-0">
                    <span className="d-flex "><i className="fa fa-dashboard"></i>Dashboard{" "}</span>
                    <button className="btn btn-outline-warning w-36 " onClick={loadDataFromDataBase}>
                        <i className="fa fa-refresh"></i>
                        Refresh
                    </button>
                </Typography>
            </Box> */}

            {/* View previous orders and new orders */}
            <Box className="orders">
                <Box className="grid grid-cols my-3">
                    <Box className="grid grid-cols-3 gap-8">
                            {/* Column of confirmed products that have been paid */}
                            <Box className="previous_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-1">
                                <Typography className="py-2 my-2 text-center text-emerald-500">
                                    <i className="fa fa-history"></i>Previous Orders{"  "}

                                    {/* Number of confirmed and paid orders */}
                                    <span className="badge bg-success">
                                        {orders.length > 0 ? 
                                            OrdersService.getPreviousOrders(orders).length
                                        :""}
                                    </span>

                                </Typography>

                                {/* There are no confirmed and paid orders */}
                                {orders.length === 0 ? 
                                    OrdersService.getPreviousOrders(orders).length === 0 ?
                                        (<Box className="messagePreviousOrder"> No Orders</Box>)
                                        :
                                        ("")
                                    
                                    :""}

                                {/* Show confirmed and paid orders */}
                                {orders.length > 0 ?
                                    OrdersService.getPreviousOrders(orders).map((order)=> {
                                        // console.log(user.id)
                                        return(
                                            <Order 
                                                key={order.id} 
                                                order={order}
                                                orderId={order.id}
                                                productId={order.productId}
                                                userId={user.id}
                                                user={user}
                                                quantity={order.quantity}
                                                imageProduct={order.imageProduct}
                                                isPaymentCompleted={order.isPaymentCompleted}
                                                productName={order.product.productName}
                                                price={order.product.price}
                                                onBuyNowClick={onBuyNowClick}
                                                onDeleteClick={onDeleteClick}
                                            />
                                        )
                                            
                                    })
                                    :""}
                            </Box>

                            {/* Column of unconfirmed products that have not been paid for */}
                            <Box className="card_order p-2 border-[2px] border-stone-700 rounded-lg p-1 col-span-2">
                                {/* The number of unconfirmed and unpaid orders */}
                                <Typography className="py-2 my-2 text-center text-yellow-500">
                                    <Box className="fa fa-shopping-cart px-1"></Box>Current Orders{" "}
                                    <span className="badge bg-cyan-700">
                                        {OrdersService.getCart(orders).length}
                                    </span>
                                </Typography>

                                {/* Display message Your order has been registered */}
                                {showOrderUpdateAlert?(
                                    <Box className="col-span-12">
                                        <Box className="alert alert-success alert-dismissible fade show mt-1" role="alert">
                                            Your Order Has Been Placed.
                                            <button 
                                                className="btn-close" 
                                                type="button" 
                                                data-dismissible="alert"
                                                onClick={()=>setShowOrderUpdateAlert(false)}
                                            ></button>
                                        </Box>
                                    </Box>
                                ):("")}

                                {/* Show message Your item has been removed from the shopping cart */}
                                {showOrderDeleteAlert?(
                                    <Box className="col-12 ">
                                        <Box className="alert alert-warning alert-dismissible fade show mt-1" role="alert">
                                            Your Item Has Been Removed From The Cart.
                                            <button 
                                                className="btn-close" 
                                                type="button" 
                                                data-dismissible="alert"
                                                onClick={()=>setShowOrderDeleteAlert(false)}
                                            ></button>
                                        </Box>
                                    </Box>
                                ):("")}

                                {/* There are no products displayed in your card */}
                                {OrdersService.getCart(orders).length === 0 ? 
                                    (<Box className="messageCurrentOrders">No Products In Your Cards</Box>):("")
                                }

                                {/* Displaying unconfirmed and unpaid orders */}
                                <Box className="Unconfirmed_Orders grid grid-cols-12 gap-4">
                                        {OrdersService.getCart(orders).map((order)=>{
                                            return (
                                                <Order 
                                                    key={order.id} 
                                                    order={order}
                                                    orderId={order.id}
                                                    productId={order.productId}
                                                    userId={user.id}
                                                    user={user}
                                                    quantity={order.quantity}
                                                    imageProduct={order.imageProduct}
                                                    isPaymentCompleted={order.isPaymentCompleted}
                                                    productName={order.product.productName}
                                                    price={order.product.price}
                                                    onBuyNowClick={onBuyNowClick}
                                                    onDeleteClick={onDeleteClick}
                                                    // changeProducted={changeProducted}
                                                />
                                            )
                                    }
                                    )}
                                </Box>
                            </Box>
                    </Box>
                </Box>
            </Box>
            
            <Box className="Accordion my-3">

                <Accordion className="my-2 border-[2px] border-stone-700 rounded-sm">

                    <AccordionSummary
                        className=""
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                            backgroundColor: "#1c1917"
                        }}
                    >
                        <Typography className="w-100 Previous_Orders"> 
                            <Typography className="py-2 my-2 text-center text-emerald-500 flex justify-evenly">
                                <i className="fa fa-history"></i>Previous Orders{"  "}
                                {/* Number of confirmed and paid orders */}
                                <span className="badge bg-success">
                                    {OrdersService.getPreviousOrders(orders).length}
                                </span>

                            </Typography>
                        </Typography>

                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                        backgroundColor: "#1c1917"
                        
                      }}
                    >
                        <Typography className="my-3 border-[2px] border-stone-500 rounded-lg py-2 px-2">
                            In this section, you can see your previous orders
                        </Typography>

                        <Box className="previous_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-2">
        
                            {/* There are no confirmed and paid orders */}
                            {OrdersService.getPreviousOrders(orders).length === 0 ?
                                (<Box className="messagePreviousOrder"> No Orders</Box>)
                                :
                                ("")
                            }

                            {/* Show confirmed and paid orders */}
                            {OrdersService.getPreviousOrders(orders).map((order)=> {
                                return (<Order 
                                        key={order.id} 
                                        orderId={order.id}
                                        productId={order.productId}
                                        userId={order.userId}
                                        quantity={order.quantity}
                                        imageProduct={order.imageProduct}
                                        isPaymentCompleted={order.isPaymentCompleted}
                                        productName={order.product.productName}
                                        price={order.product.price}
                                        onBuyNowClick={onBuyNowClick}
                                        onDeleteClick={onDeleteClick}
                                    />)
                            })}
                        </Box>

                    </AccordionDetails>

                </Accordion>

                <Accordion 
                    className="my-2 border-[2px] border-stone-700 rounded-sm"
                    expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                >

                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        sx={{
                            backgroundColor: "#1c1917"
                        }}
                    >
                        <Typography className="w-100 Card_Orders">
                            {/* The number of unconfirmed and unpaid orders */}
                            <Typography className="py-2 my-2 text-center text-yellow-500 flex justify-evenly">
                                <Box className="fa fa-shopping-cart px-1"></Box>Current Orders{" "}
                                <span className="badge bg-cyan-500 text-red-400">
                                    {OrdersService.getCart(orders).length}
                                </span>
                            </Typography>
                        </Typography>

                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            backgroundColor: "#1c1917"
                          }}
                    >
                        <Typography className="my-3 border-[2px] border-stone-500 rounded-lg py-2 px-2">
                            In this section, you can see Rami's unconfirmed orders
                        </Typography>
                        <Box className="card_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-1">
                            {/* Display message Your order has been registered */}
                            {showOrderUpdateAlert?(
                                <Box className="col-span-12">
                                    <Box className="alert alert-success alert-dismissible fade show mt-1" role="alert">
                                        Your Order Has Been Placed.
                                        <button 
                                            className="btn-close" 
                                            type="button" 
                                            data-dismissible="alert"
                                            onClick={()=>setShowOrderUpdateAlert(false)}
                                        ></button>
                                    </Box>
                                </Box>
                            ):("")}

                            {/* Show message Your item has been removed from the shopping cart */}
                            {showOrderDeleteAlert?(
                                <Box className="col-12">
                                    <Box className="alert alert-warning alert-dismissible fade show mt-1" role="alert">
                                        Your Item Has Been Removed From The Cart.
                                        <button 
                                            className="btn-close" 
                                            type="button" 
                                            data-dismissible="alert"
                                            onClick={()=>setShowOrderDeleteAlert(false)}
                                        ></button>
                                    </Box>
                                </Box>
                            ):("")}

                            {/* There are no products displayed in your card */}
                            {OrdersService.getCart(orders).length === 0 ? 
                                (<Box className="messageCurrentOrders">No Products In Your Cards</Box>):("")
                            }

                            {/* Displaying unconfirmed and unpaid orders */}
                            <Box className="Unconfirmed_Orders">
                                    {OrdersService.getCart(orders).map((order)=>{
                                    return (
                                        <Order 
                                            key={order.id} 
                                            orderId={order.id}
                                            productId={order.productId}
                                            userId={order.userId}
                                            quantity={order.quantity}
                                            imageProduct={order.imageProduct}
                                            isPaymentCompleted={order.isPaymentCompleted}
                                            productName={order.product.productName}
                                            price={order.product.price}
                                            onBuyNowClick={onBuyNowClick}
                                            onDeleteClick={onDeleteClick}
                                        />
                                    )
                                }
                                )}
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default Dashboard;