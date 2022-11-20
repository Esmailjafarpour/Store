import React , {useState,useEffect,useContext,useCallback} from 'react';
import {UserContext} from '../UserContext';
import Order from './Order';
import {OrdersService,ProductService} from '../Service';

const Dashboard = () => {

    const [orders,setOrders] = useState([]);
    const userContext = useContext(UserContext);
    const [showOrderDeleteAlert, setShowOrderDeleteAlert] = useState(false);
    const [showOrderUpdateAlert, setShowOrderUpdateAlert] = useState(false);

    // const getPreviousOrders = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === true)  
    // }
    // const getCard = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === false)
    // }
    //fetch data from orders array of database
    //(async () => {})() - anonymous function

    const loadDataFromDataBase = useCallback(async()=>{
        let orderResponse = await fetch(`http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
        {method:"GET"}
      );
      if(orderResponse.ok){
            let orderResponseBody = await orderResponse.json();
            // get all data from product
            let productsResponse = await ProductService.fetchProducts()
            if (productsResponse.ok) {
                let productsResponseBody = await productsResponse.json();
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

    const onBuyNowClick = useCallback(async (orderId,userId,productId,quantity,imageProduct) => {
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

    return(
        
        <div className="row">
            <div className="grid grid-cols py-1 title-order header title ">
                <h4 className="flex justify-between py-2 m-0">
                    <span className="d-flex "><i className="fa fa-dashboard"></i>Dashboard{" "}</span>
                    <button className="btn btn-outline-warning w-36 " onClick={loadDataFromDataBase}>
                        <i className="fa fa-refresh"></i>Refresh
                    </button>
                </h4>
            </div>
            <div className="grid grid-cols my-3">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h4 className="py-2 my-2 text-center text-emerald-500">
                            <i className="fa fa-history"></i>Previous Orders{"  "}
                            <span className="badge bg-success">
                                {OrdersService.getPreviousOrders(orders).length}
                            </span>
                        </h4>
                        {OrdersService.getPreviousOrders(orders).length === 0 ?
                            (<div className="text-yellow-700"> No Orders</div>)
                            :
                            ("")
                        }

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

                    <div className="col-span-1">
                        <h4 className="py-2 my-2 text-center text-yellow-500">
                            <div className="fa fa-shopping-cart px-1"></div>card{" "}
                            <span className="badge bg-warning">
                                {OrdersService.getCart(orders).length}
                            </span>
                        </h4>

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

                        {OrdersService.getCart(orders).length === 0 ? 
                            (<div className="text-yellow-700 text-center">No Products In Your Cards</div>):("")
                        }

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
    )
}

export default Dashboard;