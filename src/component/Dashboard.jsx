import React , {useState,useEffect,useContext} from 'react';
import {UserContext} from '../UserContext';
import Order from './Order';
import {OrdersService,ProductService} from '../Service';

const Dashboard = () => {

    const [orders,setOrders] = useState([]);

    const userContext = useContext(UserContext);

    // const getPreviousOrders = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === true)
        
    // }

    // const getCard = (orders) => {
    //     return orders.filter((order)=>order.isPaymentCompleted === false)
    // }

    useEffect(() => {
        document.title = 'Dashboard';

        // load data from dataBase
        // (async () => {})() - anonymous function
        (async () => {
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
        })(); 
    }, [userContext.user.currentUserId]);

    return(
        <div className="row">
            <div className="col-12 py-3 header">
                <h4>
                    <i className="fa fa-dashboard"></i>Dashboard
                </h4>
            </div>
            <div className="col-12">
                <div className="row">

                    <div className="col-lg-6">
                        <h4 className="py-2 my-2 text-info border-bottom border-info">
                            <i className="fa fa-history"></i>Previous Orders{"  "}
                            <span className="badge bg-info">
                                {OrdersService.getPreviousOrders(orders).length}
                            </span>
                        </h4>
                        {OrdersService.getPreviousOrders(orders).length === 0 ?

                            (<div className="text-danger"> No Orders</div>)

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
                                    isPaymentCompleted={order.isPaymentCompleted}
                                    productName={order.product.productName}
                                    price={order.product.price}
                                />)
                        })}
                    </div>

                    <div className="col-lg-6">
                        <h4 className="py-2 my-2 text-primary border-bottom border-primary">
                            <div className="fa fa-shopping-cart"></div>  card{" "}
                            <span className="badge bg-primary">
                                {OrdersService.getCart(orders).length}
                            </span>
                        </h4>
                        {OrdersService.getCart(orders).length === 0 ? 

                            (<div className="text-danger">No Products In Your Cards</div>)

                            :

                            ("")

                        }

                        {OrdersService.getCart(orders).map((order)=>{
                            return (
                                <Order 
                                    key={order.id} 
                                    orderId={order.id}
                                    productId={order.productId}
                                    userId={order.userId}
                                    quantity={order.quantity}
                                    isPaymentCompleted={order.isPaymentCompleted}
                                    productName={order.product.productName}
                                    price={order.product.price}
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