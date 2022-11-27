import React,{useState} from 'react';

const Product = ({product,onAddToCartClick,onDeletedToCartClick}) => {
    return (
        // <div className="mb-1">
            <div className="card m-1 bg-transparent border-0 overflow-hidden">
                <div className="bg-gradient border-2 shadow-2xl bg-zinc-900 border-stone-600 rounded-sm p-2 ">
                    <div class="product bg-indigo-300 rounded-lg h-60 mb-1 shadow-2xl">
                        <img class="object-cover w-100 h-30 ..." src={require(`../../public/images/${product.image}`)} alt={product.image}/>
                    </div>
                    <h6 className="text-orange-400 text-center mb-1">
                        {product.productName}<i className="fa fa-arrow-right ml-1"></i>
                    </h6>
                    {product.quantity && product.quantity>0?
                        <div className="text-lime-200 flex justify-center items-center">${(product.price.toFixed())*(product.quantity)}</div>
                        :
                        <div className="text-lime-200 flex justify-center items-center">${product.price.toFixed()}</div>
                    }
                    <div className="mt-2 text-orange-300">
                        #{product.brand.brandName} #{product.category.categoryName}
                    </div>
                    <div>
                        {[...Array(product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star text-yellow-500" key={n}></i>
                        })}
                        {[...Array(5-product.rating).keys()].map((n)=>{
                            return <i className="fa fa-star-o text-yellow-200" key={n}></i>
                        })}
                    </div>
                    <div className="flex justify-center h-15 mt-2">
                        {product.isOrdered ?( 
                            <div className="flex justify-between items-center">
                                <img src={require("../images/decrease.png")} className="w-8 h-8 cursor-pointer" alt="icons-decrease" onClick={()=>onDeletedToCartClick(product)}/>
                                {/* <button className="text-green-600 border border-yellow-800 px-3 py-2 mr-2 mb-1 rounded-xl text-sm bg-yellow-100">
                                </button> */}
                                {product.quantity>0?
                                    <span class="bg-slate-600 text-slate-100 flex justify-center items-center text-xs font-semibold m-2 px-2.5 py-0.5 rounded text-base">{product.quantity}</span>
                                    :
                                    ""
                                }  
                                <img src={require("../images/add.png")} className="w-8 h-8 cursor-pointer"  alt="icons-add" onClick={()=>onAddToCartClick(product)}/>
                                {/* <button className="bg-yellow-200 text-rose-600 border-[1px] border-rose-900 shadow-lg shadow-red-500/50 px-3 py-2 mr-2 mb-1 rounded-xl text-sm">           
                                    
                                </button> */}
                            </div>

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