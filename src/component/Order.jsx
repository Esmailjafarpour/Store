import React,{useState,useEffect} from 'react';

const Order = (props) => {
    return(
        <div className="card my-2 shadow p-3 order-card"> 
        
        {props.isPaymentCompleted === false ?
            <>
                <div class="product bg-indigo-300 rounded-sm h-60 mb-3">
                    <img class="object-cover w-100 h-30 ..." src={require(`../images/${props.imageProduct}`)} alt={props.productName}/>
                </div>
                <h6>
                    <i className="fa fa-arrow-right"></i>{props.productName}
                </h6>  
                <div className="quantity_price mt-1 w-64 mx-auto">
                    <ul className=" text-teal-100 ">
                        <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                            <span className="p-2">Quantity </span>{"    "}
                            <span className="text-green-200 p-2">{props.quantity}</span>
                        </li>
                        <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                            <span className="p-2">Price </span>{"    "}
                            <span className="text-green-200 p-2">${props.price}</span>
                        </li>
                    </ul>
                </div>  
                <div className="buttons flex justify-around">
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
                        
                </div>
            </>
            
                :
            <div className="flex justify-around items-center flex-row-reverse">
                <div className="flex flex-col ">
                    <h6 className="text-center">
                        <i className="fa fa-arrow-right"></i>{props.productName}
                    </h6>
                    
                    <div className="quantity_price mt-1 w-64 mx-auto ">
                        <ul className=" text-teal-100 ">
                            <li className="flex justify-around items-center bg-gradient-to-l from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                <span className="p-2">Quantity </span>{"    "}
                                <span className="text-green-200 p-2">{props.quantity}</span>
                            </li>
                            <li className="flex justify-around items-center bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg h-10 border-stone-700 border-[1px] p-2 my-1 shadow-inner">
                                <span className="p-2">Price </span>{"    "}
                                <span className="text-green-200 p-2">${props.price}</span>
                            </li>
                        </ul>
                    </div> 
                </div>

                 <div class="product bg-indigo-300 rounded-full h-60 mb-3">
                    <img class="object-cover w-100 h-30 ..." src={require(`../images/${props.imageProduct}`)} alt={props.productName}/>
                </div> 
            </div>                
           
            }
        </div>
    )
}

export default React.memo(Order);