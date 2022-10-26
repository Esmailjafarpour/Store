import React,{useState} from 'react';

const Product = ({product,onAddToCartClick}) => {
    return (
        <div className="col-lg-6">
            <div className="card m-1 bg-dark">
                <div className="card-body bg-gradient card-product">
                    <h5>
                        <i className="fa fa-arrow-right"></i>{product.productName}
                    </h5>
                    <div>${product.price.toFixed(2)}</div>
                    <div className="mt-2 text-muted">
                        #{product.brand.brandName} #{product.category.categoryName}
                    </div>
                    <div>
                        {[...Array(product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star text-warning" key={n}></i>
                        })}
                        {[...Array(5-product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star-o text-warning" key={n}></i>
                        })}
                    </div>
                    <div className="float-end">

                        {product.isOrdered ?( 
                            
                            <span className="text-primary">Added to card!</span>

                            ):( 
                            
                            <button 
                                className="btn btn-sm btn-card" 
                                onClick={()=>onAddToCartClick(product)}
                            >
                                <i className="fa fa-cart-plus"></i>Add to card
                            </button>

                          )
                          
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product;