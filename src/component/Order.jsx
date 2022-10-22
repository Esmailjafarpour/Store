import React,{useState,useEffect} from 'react';

const Order = (props) => {
    return(
        <div className="card my-2 shadow"> 
            <h6>
                <i className="fa fa-arrow-right"></i>{props.productName}
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
                
            </h6>
        </div>
    )
}

export default Order;