import React,{useState,useEffect,useContext} from 'react';
import {BrandsService,CategoriesService,ProductService,GetUser,OrdersService} from '../../Service.js';
import {UserContext} from '../../UserContext.js';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductOrderRegistration from '../ProductOrderRegistration';
import './style.css';

const Order = (props) => {
    const userContext = useContext(UserContext);
    const [allState, setAllState] = useState({
        orderQuantity : props.quantity,
        quantityInStock : 0
    });
    
    
    useEffect(() => {

        (async ()=>{
            let getProduct = await ProductService.fetchProducts();
            let getProductResponseBody = await getProduct.json();
            let product = getProductResponseBody.filter(product=>(product.id === props.productId))

            // let getUser = await GetUser.fetchUser();
            // let getUserResponseBody = await getUser.json();
            // let orders = getUserResponseBody.orders.filter(order=>(order.id === props.orderId))
            setAllState(prev =>({
                ...prev,
                quantityInStock : product[0].quantityInStock
            }))
        })()
        
    }, [allState.quantity,userContext.user.changeProduct]);

    // const onAddToCartClick = (product) => {
        
    //     // if(allState.quantity && allState.quantity !== 0){
    //         (async () => {
    //             setAllState(prev => ({
    //                 ...prev,
    //                 quantity : ++allState.quantity 
    //             }))

    //             console.log("quantity",allState.quantity)
                
    //             let updateProduct = {
    //                 userId: userContext.user.currentUserId,
    //                 productId: product.orderId,
    //                 quantity: allState.quantity,
    //                 isPaymentCompleted: false,
    //                 imageProduct: product.imageProduct,   
    //             }
    //             let orderResponse = await fetch(`http://localhost:5000/orders/${product.orderId}`,{
    //                 method:"PUT",
    //                 headers:{"Content-Type":"application/json"},
    //                 body : JSON.stringify(updateProduct)
    //             })
    //             let orderResponseBody = await orderResponse.json()
    //             props.changeProducted();
    //             return orderResponseBody;
    //         })()    
    //     // }
    // }

    // const onDeletedToCartClick = (product) => {
    //     if(allState.quantity && allState.quantity !== 0){
    //         (async () => {
    //             setAllState(prev => ({
    //                 ...prev,
    //                 quantity : --allState.quantity
    //             }))
                
    //             let updateProduct = {
    //                 userId: userContext.user.currentUserId,
    //                 productId: product.orderId,
    //                 quantity: allState.quantity,
    //                 isPaymentCompleted: false,
    //                 imageProduct: product.imageProduct,   
    //             }
    //             let orderResponse = await fetch(`http://localhost:5000/orders/${product.orderId}`,{
    //                 method:"PUT",
    //                 headers:{"Content-Type":"application/json"},
    //                 body : JSON.stringify(updateProduct)
    //             })
    //             let orderResponseBody = await orderResponse.json()
    //             props.changeProducted()
    //             return orderResponseBody
    //         })()
    //     }
    // }

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
                hideShoppingCart : false,
                changeProduct : !userContext.user.changeProduct
            },
            
        })
    }

    let OrderReduction = (Number)=>{
        console.log("dec",Number)
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
                hideShoppingCart : false,
                changeProduct : !userContext.user.changeProduct
            },
            
        })
    }



    return(
        <>
            {props.userId === userContext.user.currentUserId ? 
                <Box className="card my-2 shadow p-3 order-card col-span-4"> 
                
                    {props.isPaymentCompleted === false ?
                        <>
                            <Box class="product bg-indigo-300 rounded-sm h-40 mb-3 rounded">
                                <img class="object-cover w-100  ..." src={require(`../../images/${props.imageProduct}`)} alt={props.productName}/>
                            </Box>
                            <Typography className='text-center'>
                                {props.productName}<i className="fa fa-arrow-right ml-1"></i>
                            </Typography>  
                            <Box className="quantity_price mt-1 w-56 mx-auto">
                                <ul className=" text-teal-100 p-0">

                                    <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                        <span className="p-2">Price </span>{"    "}
                                        <span className="text-green-200 p-2">${props.price}</span>
                                    </li>

                                    <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                        <span className="p-2">Quantity </span>{"    "}
                                        <span className="text-green-200 p-2">{allState.orderQuantity}</span>
                                    </li>

                                    {props.order.product.discount? 
                                        <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                            <span className="p-2">Total Price</span>{"    "}
                                            <span className="border-orange-50 border-[1px] rounded-lg p-1 text-white text-xs bg-green-600">% {props.order.product.discount}</span>
                                            <span className="text-green-200 p-2">$ {(props.price.toFixed()-(props.price.toFixed()*((props.order.product.discount)/100)))*(allState.orderQuantity)}</span>
                                        </li>
                                    : 
                                        <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                            <span className="p-2">Total Price</span>{"    "}
                                            <span className="text-green-200 p-2">${(props.price*allState.orderQuantity).toFixed()}</span>
                                        </li>
                                    }
                                   

                                </ul>
                            </Box> 

                            <Box className="">
                                <Box className="buttons flex justify-center flex-d ">
                                    {/* {allState.quantity !== 0? 
                                        <img src={require("../../images/decrease.png")} 
                                            className="w-8 h-8 cursor-pointer" 
                                            alt="icons-decrease" 
                                            onClick={()=>onDeletedToCartClick(props)}
                                        />
                                        :
                                        ''
                                    } */}
                                     {/* {product.quantity>0? */}
                                        {/* <span className="bg-slate-600 text-slate-100 flex justify-center items-center 
                                                        text-xs font-semibold m-2 px-2.5 py-0.5 rounded text-base"
                                        >
                                            {allState.quantity}
                                        </span> */}
                                        {/* :
                                        ""  
                                    }  */}

                                    {/* {allState.quantity !== allState.quantityInStock?  
                                    
                                        <img src={require("../../images/add.png")} 
                                            className="w-8 h-8 cursor-pointer"  
                                            alt="icons-add" 
                                            onClick={()=>onAddToCartClick(props)}
                                        />

                                     : 
                                         "" 
                                     }  */}


                                    <ProductOrderRegistration 
                                        product={props.order.product} 
                                        orderQuantity={allState.orderQuantity} 
                                        AddOrder={AddOrder}
                                        OrderReduction={OrderReduction}
                                        hiddenAddToCard={true}
                                        // quantityInStock={allState.quantityInStock}
                                        // onCheckLogin={onCheckLogin}
                                        // showChange={showChange}
                                        // currentUser={allState.currentUser}
                                    />

                                </Box>
                                <Box className="buttons flex justify-center flex-d ">
                                    
                                    <button 
                                        className="rounded-lg me-2 w-36 bg-gradient-to-r from-emerald-600 to-emerald-500 text-teal-50 h-9"
                                        onClick={() => {
                                            props.onBuyNowClick(
                                                props.orderId,
                                                props.userId,
                                                props.productId,
                                                props.quantity,
                                                props.imageProduct
                                                )
                                            }}
                                            >
                                        <i className="fa fa-truck"></i>Buy Now
                                    </button>
                                       
                                    
                                    <button 
                                        className="rounded-lg me-2 w-36 bg-gradient-to-l from-amber-600 to-amber-500 text-teal-50 h-9"
                                        onClick={()=>{
                                            props.onDeleteClick(
                                                props.orderId,
                                                props.userId
                                                )
                                        }}
                                        >
                                        <i className="fa fa-trash-o"></i>Delete
                                    </button>
                                </Box>
                                    
                            </Box>
                        </>
                            :
                        <Box className="flex justify-around items-center flex-row-reverse">
                            <Box className="flex flex-col ">
                                <Typography className="text-center">
                                    {props.productName}<i className="fa fa-arrow-right ml-2"></i>
                                </Typography>
                                
                                <Box className="quantity_price mt-1 w-64 mx-auto ">
                                    <ul className=" text-teal-100">
                                        <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                            <span className="p-2">Price </span>{"    "}
                                            <span className="text-green-200 p-2">${props.price}</span>
                                        </li>
                                        <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                            <span className="p-2">Quantity </span>{"    "}
                                            <span className="text-green-200 p-2">{allState.orderQuantity}</span>
                                        </li>
                                       
                                        <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                            <span className="p-2">Total Price</span>{"    "}
                                            <span className="text-green-200 p-2">${props.price*allState.orderQuantity}</span>
                                        </li>
                                    </ul>
                                </Box> 
                            </Box>

                            <Box className="product bg-indigo-300 rounded-[16px] h-50">
                                <img className="object-cover ..." src={require(`../../images/${props.imageProduct}`)} alt={props.productName}/>
                            </Box> 
                        </Box>                
                    
                    }
                </Box>
            :""}
        </>  
    )
}

export default React.memo(Order);