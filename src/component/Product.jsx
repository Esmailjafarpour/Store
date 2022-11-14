import React,{useState} from 'react';

const Product = ({product,onAddToCartClick}) => {
    return (
        <div className="col-lg-6 mb-1">
            <div className="card m-1 bg-stone-800 overflow-hidden">
                <div className="bg-gradient border-stone-700 bg-zinc-900 p-3">
                    <h5 className="text-orange-400">
                        <i className="fa fa-arrow-right"></i>{product.productName}
                    </h5>
                    <div className="text-lime-200">${product.price.toFixed(2)}</div>
                    <div className="mt-2 text-orange-300">
                        # {product.brand.brandName} # {product.category.categoryName}
                    </div>
                    <div>
                        {[...Array(product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star text-yellow-500" key={n}></i>
                        })}
                        {[...Array(5-product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star-o text-yellow-200" key={n}></i>
                        })}
                    </div>
                    <div className="float-end">

                        {product.isOrdered ?( 
                            <button className="text-green-600 border border-yellow-800 px-3 py-2 mr-2 mb-1 rounded-xl text-sm bg-lime-200">
                                Added to card!
                            </button>
                            ):( 
                            <button 
                                className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2 mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900" 
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