
import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../UserContext.js';
import Box from '@mui/material/Box';
import {OrdersService,GetUser} from '../../Service.js';
import ProductOrderRegistration from '../ProductOrderRegistration';
import "./style.css";
// import Grid3x3Icon from '@mui/icons-material/Grid3x3';

const Product = ({product,onShowDetailsProduct,onCheckLogin,totalOrders}) => {
    const userContext = useContext(UserContext);
    const [allState, setAllState] = useState({
        color : "",
        // totalOrders : [],
        // showOrder : false,
        resultBeforeOrder : [],
        quantityInStock : product.quantityInStock,
        currentUser : [],
        orderQuantity : 0
    });

    useEffect(() => {

        (async ()=>{

            // const ordersResponse = await OrdersService.fetchOrders();
            // const ordersResponseBody = await ordersResponse.json();
            // let beforeOrders = ordersResponseBody.filter((order)=>(
            //     order.productId === product.id
            // ))

            let usersResponse = await GetUser.fetchUser();
            let usersResponseBody = await usersResponse.json();
            let user = await usersResponseBody.filter((user) => (
                user.id === userContext.user.currentUserId
            ))
        
            setAllState(prev => ({
                ...prev,
                currentUser : user[0],
            }))

            if(userContext.user.currentUserId === user[0].id && user[0].orders && user[0].orders.length>0){

                let numberOfPrevProductOrders = user[0].orders.filter(order => (
                    order.id === product.id
                ))

                if(numberOfPrevProductOrders[0] !== undefined){
                    setAllState((prev) =>({
                        ...prev,
                        // showOrder : true,
                        orderQuantity : numberOfPrevProductOrders[0].quantity,
                        // showChangeProduct : true,
                        quantityInStock : product.quantityInStock - numberOfPrevProductOrders[0].quantity
                    })) 

                }
                
            }   

        })()
      
    }, [product.quantityInStock,userContext.user.changeProduct]);

    
    let AddOrder = (Number)=>{

            setAllState(prev=>({
                ...prev,
                quantityInStock : --allState.quantityInStock,
                orderQuantity : ++allState.orderQuantity
     
            }))

            totalOrders("add",allState.orderQuantity)
    }
    
    let OrderReduction = (Number)=>{
            setAllState(prev=>({
                ...prev,
                quantityInStock : ++allState.quantityInStock,
                orderQuantity :  --allState.orderQuantity
    
            }))
            totalOrders("dec",allState.orderQuantity)
    }

   
    // const showChange = () =>{
    //     setAllState(prev =>({
    //         ...prev,
    //         showOrder : !allState.showOrder
    //     }))
    // }

   
    return (
      
        <Box className="product card m-1 bg-transparent border-0 overflow-hidden col-span-4">
                <Box className="box-product bg-gradient border-2 shadow-2xl bg-zinc-900 border-stone-600 rounded-sm p-2 ">
                    {product.discount>0?
                        <Box className="discount">
                            <Box className="discount_product">
                                <span style={{color:allState.state}}>{product.discount} %</span>
                            </Box>
                        </Box>
                    :null}
                    <Box className="product bg-indigo-300 rounded-lg h-60 mb-1 shadow-2xl cursor-pointer">
                        <img className="object-cover w-100 h-30 transition ease-in-out delay-170 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-700" 
                            src={require(`../../images/${product.image}`)} alt={product.image}
                            onClick={()=>{onShowDetailsProduct(product.id)}}
                        />
                    </Box>
                    <h6 className="productName text-orange-400 text-center mt-3 mb-3">
                        {product.productName}<i className="fa fa-arrow-right ml-1"></i>
                    </h6>

                    {product.discount>0?

                        <Box className="flex justify-center mt-3 mb-3">

                            {allState.orderQuantity && allState.orderQuantity>0?
                                <Box className="product_price text-lime-200 flex justify-center items-center bg-stone-700 rounded p-0.5 rounded text-indigo-200 text-[12px]" style={{textDecoration: 'line-through'}}>
                                    $ {(product.price.toFixed())*(allState.orderQuantity)}
                                </Box>
                                :
                                <Box className="product_price text-lime-200 flex justify-center items-center bg-stone-700 rounded p-0.5 rounded text-indigo-200 text-[12px]" style={{textDecoration: 'line-through'}}>
                                    $ {product.price.toFixed()}
                                </Box>
                            }

                            <span className="w-10 mx-4 bg-amber-500 p-0.5 rounded text no-underline text-white text-[15px] text-center">
                                {product.discount} %
                            </span>

                            {allState.orderQuantity && allState.orderQuantity>0?
                                <Box className="product_price flex justify-center items-center bg-green-600 p-0.5 rounded text-slate-50 text-[14px]">
                                    $ {(((product.price.toFixed())-(product.price.toFixed()*((product.discount)/100)))*(allState.orderQuantity))}
                                </Box>
                                :
                                <Box className="product_price flex justify-center items-center bg-green-600 p-0.5 rounded text-slate-50 text-[14px]">
                                    $ {(product.price.toFixed())-(product.price.toFixed()*((product.discount)/100))}
                                </Box>
                            }

                        </Box>

                    :
                        <>
                            {allState.orderQuantity && allState.orderQuantity>0?
                                <Box className="product_price text-lime-200 my-[17px] flex justify-center items-center">
                                    $ {(product.price.toFixed())*(allState.orderQuantity)}
                                </Box>
                                :
                                <Box className="product_price text-lime-200 my-[17px] flex justify-center items-center">
                                    $ {product.price.toFixed()}
                                </Box>
                            }
                        </>
                    }
                    <Box className="brand mt-2 text-orange-300">
                        {/* <Grid3x3Icon/> */}
                        <i className="fa fa-hashtag hashtag" aria-hidden="true">{" "}</i>{product.brand.brandName} 
                        {"   "}
                        <i className="fa fa-hashtag hashtag" aria-hidden="true">{" "}</i>{product.category.categoryName}
                    </Box>
                    <Box className="rating_number flex justify-between items-center">
                        <Box>
                            {[...Array(product.rating).keys()].map((n)=>{
                                return <i className="fa fa-star text-yellow-500" key={n}></i>
                            })}
                            {[...Array(5-product.rating).keys()].map((n)=>{
                                return <i className="fa fa-star-o text-yellow-200" key={n}></i>
                            })} 
                        </Box>
                        <Box className="product_quantityInStock">
                            {allState.quantityInStock > 0 ?
                                <>
                                    <span className="product_quantity text-violet-300">Stock</span>
                                    <span className="text-indigo-50 mx-2 bg-neutral-700 p-0.5 border-[2px] border-purple-300 rounded-full quantityInStock_number">{allState.quantityInStock}</span>
                                </>
                                :
                                <>
                                    <span className="product_quantity text-red-900">warehouse stock</span>
                                    <span className="text-indigo-50 mx-1 bg-neutral-700 p-0.5 border-[2px] border-purple-300 rounded-full quantityInStock_number">{allState.quantityInStock}</span>
                                </>
                            }
                        </Box>
                        
                    </Box>
                    <Box className="flex justify-center h-15 mt-2">

                            <ProductOrderRegistration 
                                product={product} 
                                orderQuantity={allState.orderQuantity} 
                                onCheckLogin={onCheckLogin}
                                AddOrder={AddOrder}
                                OrderReduction={OrderReduction}
                                hiddenAddToCard={false}
                                // quantityInStock={allState.quantityInStock}
                                // showChange={showChange}
                                // currentUser={allState.currentUser}
                            />
   
                    </Box>
                </Box>
            </Box>
        
    )
}

export default Product;