import React , {useState,useEffect,useContext,useCallback} from 'react';
import {UserContext} from '../../UserContext.js';
import Order from '../../component/Order/Order';
import {OrdersService,ProductService} from '../../Service.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./Dashboard.css";

const Dashboard = () => {

    const [orders,setOrders] = useState([]);
    const userContext = useContext(UserContext);
    const [showOrderDeleteAlert, setShowOrderDeleteAlert] = useState(false);
    const [showOrderUpdateAlert, setShowOrderUpdateAlert] = useState(false);
    const [expanded, setExpanded] = React.useState('panel1');

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
        let orderResponse = await fetch(`http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
        {method:"GET"}
      );
      if(orderResponse.ok){
            let orderResponseBody = await orderResponse.json();

            // get all data from product
            let productsResponse = await ProductService.fetchProducts()
            if (productsResponse.ok) {
                let productsResponseBody = await productsResponse.json();

                // Find the ordered product from all available products
                orderResponseBody.forEach((order) => {
                    order.product = ProductService.getProductByProductId(productsResponseBody,order.productId)
                });
            }
            setOrders(orderResponseBody)
        }
    },[userContext.user.currentUserId])  
    

    useEffect(() => {
        document.title = 'Dashboard';
        loadDataFromDataBase();
    },[userContext.user.currentUserId,loadDataFromDataBase]);

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
            let orderResponse = await fetch(
                `http://localhost:5000/orders/${orderId}`,{
                    method:"PUT",
                    body:JSON.stringify(updateOrder),
                    headers:{"Content-type":"application/json"}
                }
            )
            if(orderResponse.ok) {
                let orderReponseBody = await orderResponse.json();
                loadDataFromDataBase();
                setShowOrderUpdateAlert(true)
            }
        }
    },[loadDataFromDataBase])

    // Delete order
    const onDeleteClick = useCallback(async(orderId)=>{
        if (window.confirm("Are you sure to delete this item from card?")) {
            let orderResponse = await fetch(`http://localhost:5000/orders/${orderId}`,{method : "DELETE"})
            if (orderResponse.ok) {
                let orderReponseBody = await orderResponse.json();
                loadDataFromDataBase();
                setShowOrderDeleteAlert(true)
            }
        }
    },[loadDataFromDataBase])


    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
      };

    return(
        
        <div className="">
            <div className="grid grid-cols py-1 border-stone-700 title-order header-dashboard title ">
                <h4 className="flex justify-between py-2 m-0">
                    <span className="d-flex "><i className="fa fa-dashboard"></i>Dashboard{" "}</span>
                    <button className="btn btn-outline-warning w-36 " onClick={loadDataFromDataBase}>
                        <i className="fa fa-refresh"></i>Refresh
                    </button>
                </h4>
            </div>

            {/* View previous orders and new orders */}
            <div className="orders">
                <div className="grid grid-cols my-3">
                    <div className="grid grid-cols-3 gap-8">
                        
                            {/* Column of confirmed products that have been paid */}
                            <div className="previous_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-2">
                                <h4 className="py-2 my-2 text-center text-emerald-500">
                                    <i className="fa fa-history"></i>Previous Orders{"  "}

                                    {/* Number of confirmed and paid orders */}
                                    <span className="badge bg-success">
                                        {OrdersService.getPreviousOrders(orders).length}
                                    </span>

                                </h4>

                                {/* There are no confirmed and paid orders */}
                                {OrdersService.getPreviousOrders(orders).length === 0 ?
                                    (<div className="text-yellow-700"> No Orders</div>)
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
                            </div>

                            {/* Column of unconfirmed products that have not been paid for */}
                            <div className="card_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-1">
                                {/* The number of unconfirmed and unpaid orders */}
                                <h4 className="py-2 my-2 text-center text-yellow-500">
                                    <div className="fa fa-shopping-cart px-1"></div>card{" "}
                                    <span className="badge bg-warning">
                                        {OrdersService.getCart(orders).length}
                                    </span>
                                </h4>

                                {/* Display message Your order has been registered */}
                                {showOrderUpdateAlert?(
                                    <div className="col-span-12">
                                        <div className="alert alert-success alert-dismissible fade show mt-1" role="alert">
                                            Your Order Has Been Placed.
                                            <button 
                                                className="btn-close" 
                                                type="button" 
                                                data-dismissible="alert"
                                                onClick={()=>setShowOrderUpdateAlert(false)}
                                            ></button>
                                        </div>
                                    </div>
                                ):("")}

                                {/* Show message Your item has been removed from the shopping cart */}
                                {showOrderDeleteAlert?(
                                    <div className="col-12">
                                        <div className="alert alert-warning alert-dismissible fade show mt-1" role="alert">
                                            Your Item Has Been Removed From The Cart.
                                            <button 
                                                className="btn-close" 
                                                type="button" 
                                                data-dismissible="alert"
                                                onClick={()=>setShowOrderDeleteAlert(false)}
                                            ></button>
                                        </div>
                                    </div>
                                ):("")}

                                {/* There are no products displayed in your card */}
                                {OrdersService.getCart(orders).length === 0 ? 
                                    (<div className="text-yellow-700 text-center">No Products In Your Cards</div>):("")
                                }

                                {/* Displaying unconfirmed and unpaid orders */}
                                <div className="Unconfirmed_Orders">
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
                                </div>
                            </div>

                    </div>
                </div>
            </div>
            
            <div className="Accordion my-3">

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
                        <Typography className="w-100"> 
                            <h4 className="py-2 my-2 text-center text-emerald-500 flex justify-evenly">
                                <i className="fa fa-history"></i>Previous Orders{"  "}
                                {/* Number of confirmed and paid orders */}
                                <span className="badge bg-success">
                                    {OrdersService.getPreviousOrders(orders).length}
                                </span>

                            </h4>
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

                        <div className="previous_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-2">
        
                            {/* There are no confirmed and paid orders */}
                            {OrdersService.getPreviousOrders(orders).length === 0 ?
                                (<div className="text-yellow-700"> No Orders</div>)
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
                        </div>

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
                        <Typography className="w-100">
                            {/* The number of unconfirmed and unpaid orders */}
                            <h4 className="py-2 my-2 text-center text-yellow-500 flex justify-evenly">
                                <div className="fa fa-shopping-cart px-1"></div>card{" "}
                                <span className="badge bg-warning">
                                    {OrdersService.getCart(orders).length}
                                </span>
                            </h4>
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
                        <div className="card_order border-[2px] border-stone-700 rounded-lg h-fit p-1 col-span-1">
                            {/* Display message Your order has been registered */}
                            {showOrderUpdateAlert?(
                                <div className="col-span-12">
                                    <div className="alert alert-success alert-dismissible fade show mt-1" role="alert">
                                        Your Order Has Been Placed.
                                        <button 
                                            className="btn-close" 
                                            type="button" 
                                            data-dismissible="alert"
                                            onClick={()=>setShowOrderUpdateAlert(false)}
                                        ></button>
                                    </div>
                                </div>
                            ):("")}

                            {/* Show message Your item has been removed from the shopping cart */}
                            {showOrderDeleteAlert?(
                                <div className="col-12">
                                    <div className="alert alert-warning alert-dismissible fade show mt-1" role="alert">
                                        Your Item Has Been Removed From The Cart.
                                        <button 
                                            className="btn-close" 
                                            type="button" 
                                            data-dismissible="alert"
                                            onClick={()=>setShowOrderDeleteAlert(false)}
                                        ></button>
                                    </div>
                                </div>
                            ):("")}

                            {/* There are no products displayed in your card */}
                            {OrdersService.getCart(orders).length === 0 ? 
                                (<div className="text-yellow-700 text-center">No Products In Your Cards</div>):("")
                            }

                            {/* Displaying unconfirmed and unpaid orders */}
                            <div className="Unconfirmed_Orders">
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
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            
        </div>
    )
}

export default Dashboard;