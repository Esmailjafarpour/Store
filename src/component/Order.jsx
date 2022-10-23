import React,{useState,useEffect} from 'react';

const Order = (props) => {
    console.log("Order Component rendered",props)
    return(
        <div className="card my-2 shadow p-3"> 
            <h6>
                <i className="fa fa-arrow-right"></i>{props.productName}
                <div className="float-end">
                    {props.isPaymentCompleted === false ? 
                        <>
                            <button 
                                className="btn btn-sm btn-info me-2"
                                onClick={() => {
                                    props.onBuyNowClick(
                                        props.orderId,
                                        props.userId,
                                        props.productId,
                                        props.quantity
                                    )
                                }}
                            >
                                <i className="fa fa-truck"></i>Buy Now
                            </button>
                            <button 
                                className="btn btn-sm btn-danger"
                                onClick={()=>{
                                    props.onDeleteClick(props.orderId)
                                }}
                            >
                                <i className="fa fa-trash-o"></i>Delete
                            </button>
                        </>
                        :

                        ""
                    }
                </div>
            </h6>    
                <table className="table-sm table border-less mt-1">
                    <tbody>
                        <tr>
                            <td style={{width:"100px"}}>Quantity : </td>
                            <td>{props.quantity}</td>
                        </tr>
                        <tr>
                            <td style={{width:"100px"}}>Price : </td>
                            <td>${props.price}</td>
                        </tr>
                    </tbody>
                </table>
        </div>
    )
}

export default React.memo(Order);