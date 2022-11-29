import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../UserContext.js';
import {BrandsService,CategoriesService,ProductService} from '../Service.js';
import Product from './Product';
import Show from './Show';
import Slider from './Slider';

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

    useEffect(() => (
        userContext.dispatchBrands({
            type:"brands",
            payload:{
              brands : brands  
            },
        })

    ), [brands]);

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
        let orderNumber = []
        setProductToShow(
            products
            .filter((prod) => {
                return categories.filter((cat)=> cat.id === prod.categoryId && cat.isChecked).length > 0
            })
            .filter((prod) => {
                return brands.filter((brand)=> brand.id === prod.brandId && brand.isChecked).length > 0
            })
        )

        products.map((product)=>orderNumber.push(product.quantity))
        let totalOrders = 0
        orderNumber.forEach(element => {
            if(element !== undefined){
                totalOrders += element
            }
        });

        userContext.dispatch({
                type:"login",
                payload:{
                    currentUserId : userContext.user.currentUserId,
                    currentUserName : userContext.user.currentUserName,
                    currentUserRole : userContext.user.currentUserRole,
                    orderNumber : totalOrders,
                    imageUser :userContext.user.imageUser
                },
            })  
            
        
                 
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

            let num = 0;
            let prods = products.map((p) =>{
                if (p.id === product.id){
                    p.isOrdered = true;
                    p.quantity = ++num
                    newOrder.quantity = ++num
                }
                return p
            })
        
            let orderResponse = await fetch(`http://localhost:5000/orders`,{
                method : "POST",
                body : JSON.stringify(newOrder),
                headers:{"Content-Type":"application/json"}
            })

            if(orderResponse.ok){
                let orderResponseBody = await orderResponse.json();
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
            <div className="mt-1">
                <div className="grid grid-cols-12 gap-2 z-[1000] px-1 py-2 bg-stone-900 rounded-lg border-[1px] border-stone-700 sticky top-[68px]">
                    <div className="title col-span-2 ">
                        <h5 className="px-2 py-0.5 my-1 d-flex justify-between items-center text-orange-300">
                            <span>
                                Store{" "}<i className="fa fa-shopping-bag"></i> 
                            </span>
                            <span className="px-3 py-1 my-1 rounded-lg bg-neutral-700 text-orange-100 bg-gradient">
                                {productToShow.length}
                            </span>
                        </h5>
                    </div>
                    <div className="col-span-10 w-6/12 py-2 mx-auto">
                        <input  
                            type="search"
                            value={search}
                            placeholder="Search Product"
                            className="bg-stone-700 w-full px-3 py-1.5 text-orange-100 rounded border-2 
                                border-solid border-slate-700 focus:text-orange-100 focus:outline-none
                                font-normal transition ease-in-out mx-auto"
                            autoFocus="autofocus"
                            onChange={(e)=>{setSearch(e.target.value)}}
                        />
                    </div>
                </div>
        
                <div className="grid grid-cols-12 gap-3 mx-auto sticky rounded-lg border-[2px] border-stone-800 mt-3 px-2">
                    <div className="col-span-2 px-2 py-2 mt-3 h-fit bg-stone-800 rounded-lg ">
                        <div className="my-1">
                            <h5 className="text-amber-100 px-2">Brands</h5>
                            <ul className="list-group list-group-flush">
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
                            <h5 className="text-amber-100 px-2">Categories</h5>
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

                    <div className="col-span-10 py-2">
                        <div className="rounded-lg border-[2px] border-stone-800 mt-3 p-2">
                            <Slider productToShow={productToShow}/>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 border-[1px] border-stone-900 rounded-lg p-2 m-2">
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