import React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import './order.css';

const Order = (props) => {
    return(
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
                            <span className="p-2">Quantity </span>{"    "}
                            <span className="text-green-200 p-2">{props.quantity}</span>
                        </li>
                        <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                            <span className="p-2">Price </span>{"    "}
                            <span className="text-green-200 p-2">${props.price}</span>
                        </li>
                    </ul>
                </Box>  
                <Box className="buttons flex justify-center flex-d ">
                    <>
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
                                props.onDeleteClick(props.orderId)
                            }}
                        >
                            <i className="fa fa-trash-o"></i>Delete
                        </button>
                    </>
                        
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
                                <span className="p-2">Quantity </span>{"    "}
                                <span className="text-green-200 p-2">{props.quantity}</span>
                            </li>
                            <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                <span className="p-2">Price </span>{"    "}
                                <span className="text-green-200 p-2">${props.price}</span>
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
    )
}

export default React.memo(Order);