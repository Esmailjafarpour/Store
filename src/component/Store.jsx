import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../UserContext.js';
import {BrandsService,CategoriesService,ProductService} from '../Service.js';
import Product from './Product';
import Show from './Show';

const Store = () => {
    const userContext = useContext(UserContext);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productToShow, setProductToShow] = useState([]);
    const [search, setSearch] = useState('');
    const [productsId,setProductsId] = useState([]);
    const [showLoginMessage ,setShowLoginMessage ] = useState(false);
    
    useEffect(() => {
        (async () => {
            let brandResponse = await BrandsService.fetchBrands();
            let brandResponseBody = await brandResponse.json();
            brandResponseBody.forEach((brand) => {
                brand.isChecked = true;
            }); 
            setBrands(brandResponseBody);
            let categoriesResponse = await CategoriesService.fetchCategories();
            let categoriesResponseBody = await categoriesResponse.json();
            categoriesResponseBody.forEach((category) => {
                category.isChecked = true;
            });
            setCategories(categoriesResponseBody);

            let productsResponse = await fetch(`http://localhost:5000/products?productName_like=${search}`,{method:"GET"});
            let productsResponseBody = await productsResponse.json();
            if(productsResponse.ok){
                productsResponseBody.forEach((product) => {
                    product.brand = BrandsService.getBrandByBrandId(brandResponseBody,product.brandId)
                    product.category = CategoriesService.getCategoryByCategoryId(categoriesResponseBody,product.categoryId)
                    product.isOrdered = false;
                });
            }
            setProducts(productsResponseBody);
            setProductToShow(productsResponseBody);
            document.title = "Store"

        })();
    },[search]);

    const updateBrandIsChecked = (id) => {
        let brandsData = brands.map((brand)=>{
            if(brand.id === id) brand.isChecked = !brand.isChecked;
            return brand
        })
        setBrands(brandsData);
        updateProductToShow()
    }

    const updateCategoriesChecked = (id) => {
        let categoriesData = categories.map((category)=>{
            if(category.id === id) category.isChecked = !category.isChecked;
            return category
        })
        setCategories(categoriesData);
        updateProductToShow();
    }

    const updateProductToShow = () =>{
        setProductToShow(
            products
            .filter((prod) => {
                return categories.filter((cat)=> cat.id === prod.categoryId && cat.isChecked).length > 0
            })
            .filter((prod) => {
                return brands.filter((brand)=> brand.id === prod.brandId && brand.isChecked).length > 0
            })
            
        )
    }

    const onAddToCartClick = (product) => {
        if(userContext.user.currentUserId === null){
            setShowLoginMessage(true)
            return
        }

        if(product.quantity && product.quantity !== 0){
            let prods = products.map((p) =>{
            (async () => {
                if (p.id === product.id){
                        p.quantity = ++p.quantity;
                        let orderResponse = await fetch(`http://localhost:5000/orders?${product.id}`,{
                        method : "PUT",
                        body : JSON.stringify(product),
                        headers:{"Content-Type":"application/json"}
                    })
                }
            })()
                return p
        })
            
            setProducts(prods);
            updateProductToShow();
            return
        }
        createNewOrder(product);
    }

    const createNewOrder = (product) => {
        
        (async ()=>{
            let newOrder = {
                userId : userContext.user.currentUserId,
                productId : product.id,
                quantity : 0,
                isPaymentCompleted : false,
                imageProduct:product.image
            };
        
            let orderResponse = await fetch(`http://localhost:5000/orders`,{
                method : "POST",
                body : JSON.stringify(newOrder),
                headers:{"Content-Type":"application/json"}
            })

            if(orderResponse.ok){
                let num = 0;
                let orderResponseBody = await orderResponse.json();
                let prods = products.map((p) =>{
                    if (p.id === product.id){
                        p.isOrdered = true;
                        p.quantity = ++num
                    }
                    return p
                })
                setProducts(prods);
                updateProductToShow();
            }
        })();
    }
    
    const onDeletedToCartClick = (product) => {
        if(product.quantity && product.quantity > 0){
            let prods = products.map((p) =>{
                if (p.id === product.id){
                    p.quantity = --p.quantity
                    if(p.quantity === 0){        
                        product.isOrdered = false;
                    }
                }
                return p
            })
            setProducts(prods);
            updateProductToShow();
        }
                  
    }

        
    return(
        <>
            <Show showLoginMessage={showLoginMessage} hiddenLoginMessage={()=>(setShowLoginMessage())}/>
            
            <div className="row ">
                <div className="grid grid-cols-12 gap-3 mt-3">
                    <div className="title col-span-3 card-product">
                        <h4 className="px-2 py-0.5 my-1 d-flex justify-between items-center text-orange-300">
                            <span>
                                <i className="fa fa-shopping-bag"></i> Store{" "}
                            </span>
                            <span className="px-3 py-0.5 my-1 rounded-lg bg-neutral-700 text-orange-300 bg-gradient">
                                {productToShow.length}
                            </span>
                        </h4>
                    </div>
                    <div className="col-span-9 py-2">
                        <input  
                            type="search"
                            value={search}
                            placeholder="Search Product"
                            className="bg-stone-700 w-full px-3 py-1.5 text-orange-100 rounded border-2 
                                border-solid border-slate-700 focus:text-orange-100 focus:outline-none
                                font-normal transition ease-in-out m-0"
                            autoFocus="autofocus"
                            onChange={(e)=>{setSearch(e.target.value)}}
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-12 gap-3 mx-auto">
                    <div className="col-span-3 py-2">
                        <div className="my-2">
                            <h5 className="text-amber-100 px-2 py-1">Brands</h5>
                            <ul className="list-group list-group-flush ">
                                {brands.map((brand)=>(
                                    <li className="px-2 py-2 my-1 bg-neutral-700 text-emerald-100 rounded-lg shadow-3xl border-yellow-900" key={brand.id}>
                                        <div className="form-check">
                                            <input 
                                                type="checkBox" 
                                                className="form-check-input bg-secondary"
                                                value="true"
                                                checked={brand.isChecked}
                                                id={`brand${brand.id}`}
                                                onChange={()=>{
                                                    updateBrandIsChecked(brand.id)
                                                }}
                                            />
                                            <label htmlFor={`brand${brand.id}`} className="form-check-label">
                                                {brand.brandName}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="my-2">
                            <h5 className="text-amber-100 px-2 py-1">Categories</h5>
                            <ul className="list-group list-group-flush">
                                {categories.map((category)=>(
                                    <li className="px-2 py-2 my-1 bg-neutral-700 text-emerald-100 rounded-lg shadow-3xl border-yellow-900" key={category.id}>
                                        <div className="form-check">
                                            <input 
                                                type="checkBox" 
                                                className="form-check-input bg-secondary"
                                                value="true"
                                                checked={category.isChecked}
                                                id={`category${category.id}`}
                                                onChange={()=>{
                                                    updateCategoriesChecked(category.id)
                                                }}
                                            />
                                            <label htmlFor={`category${category.id}`} className="form-check-label">
                                                {category.categoryName}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-span-9 py-2">
                        <div className="grid grid-cols-2 gap-2">
                        {productToShow.map((product) => (
                            <Product 
                                key={product.id} 
                                product={product} 
                                onAddToCartClick={onAddToCartClick} 
                                onDeletedToCartClick={onDeletedToCartClick}
                            />
                        ))}
                        </div>
                    </div>
                </div>
            </div>  
        </>
    )
}

export default Store;