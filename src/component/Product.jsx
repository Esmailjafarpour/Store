import React,{useState} from 'react';

const Product = ({product,onAddToCartClick}) => {
    return (
        // <div className="mb-1">
            <div className="card m-1 bg-transparent border-0 overflow-hidden">
                <div className="bg-gradient border-2 shadow-2xl bg-zinc-900 border-stone-600 rounded-lg p-3 ">
                    <div class="product bg-indigo-300 rounded-sm h-60 mb-3">
                        <img class="object-cover w-100 h-30 ..." src={require(`../../public/images/${product.image}`)} alt={product.image}/>
                    </div>
                    <h5 className="text-orange-400 text-center mb-3">
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
                    <div className="flex justify-center">
                        {product.isOrdered ?( 
                            <button className="text-green-600 border border-yellow-800 px-3 py-2 mr-2 mb-1 rounded-xl text-sm bg-yellow-100">
                                Added to card!
                            </button>
                            ):( 
                            <button 
                                className="text-green-200 border-2 border-neutral-600
                                focus:outline-none rounded-lg text-sm px-3 py-2 text-center 
                                mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100" 
                                onClick={()=>onAddToCartClick(product)}
                            >
                                <i className="fa fa-cart-plus"></i>Add to card
                            </button>

                          )
                        }
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default Product;