import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../UserContext.js';
import {BrandsService,CategoriesService,ProductService} from '../../Service.js';
import Product from '../Product/Product';
import ModalComponents from '../ModalComponents/ModalComponents';
import Slider from '../Slider/Slider';
import {NavLink,useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import "./store.css";


const style = {

    styleBox :{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        bgcolor: '#201f1f',
        border: '2px solid #808080',
        borderRadius: '16px',
        color :"#ffffff",
        boxShadow: 24,
        p: 2,
    },
    
    media: {
        height: 200,
      }
  };

const Store = () => {
    const userContext = useContext(UserContext);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productToShow, setProductToShow] = useState([]);
    const [search, setSearch] = useState('');
    const [productsId,setProductsId] = useState([]);
    const [showLoginMessage ,setShowLoginMessage ] = useState(false);
    const [y, setY] = useState(window.scrollY);
    const [open, setOpen] = React.useState(false);
    const [showDetail, setShowDetail] = React.useState({
        id: "",
        productName: "",
        price: "",
        brandId: "",
        categoryId: "",
        rating: "",
        image: "",
        quantityInStock: "" 
    });
       
    const handleClose = () => (
        setOpen(false),
        setShowDetail({
            id: "",
            productName: "" ,
            price: "",
            brandId: "",
            categoryId: "",
            rating: "",
            image: "",
            quantityInStock: "" 
        })
    );

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
        

        if(userContext.user.currentUserId){
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
                            product.quantity = ++product.quantity;
                            product.quantityInStock = -- product.quantityInStock 
                            let updateProduct = {
                                    userId: userContext.user.currentUserId,
                                    productId: product.id,
                                    quantity: product.quantity,
                                    isPaymentCompleted: false,
                                    imageProduct: product.image,   
                            }
                            let orderResponse = await fetch(`http://localhost:5000/orders?userId=${userContext.user.currentUserId}&productId=${product.id}`,{
                                method:"PUT",
                                body : JSON.stringify(updateProduct),
                                headers:{"Content-Type":"application/json"}
                            })
                            let orderResponseBody = await orderResponse.json()
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
                    p.quantityInStock = -- p.quantityInStock
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
                    p.quantityInStock = ++ p.quantityInStock
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

    const showDetailsProduct = async (id) => {
         let productResponse = await fetch(`http://localhost:5000/products/${id}`,{method:"GET"});
         let productResponseBody = await productResponse.json();
        if(productResponse.ok){
            let productsDetail={
                id: productResponseBody.id,
                productName: productResponseBody.productName,
                price: productResponseBody.price,
                brandId: productResponseBody.brandId,
                categoryId: productResponseBody.categoryId,
                rating: productResponseBody.rating,
                image: productResponseBody.image,
                quantityInStock: productResponseBody.quantityInStock, 
                discount: productResponseBody.discount
            }
            setShowDetail(productsDetail)
         }
        
         setOpen(true)
    }
  
    return(
        <>   

        {showDetail.id !== "" ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{backdropFilter: "blur(3px)"}}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                        <Box sx={style.styleBox} className="content-box2">

                            <div className="w-100 flex flex-col justify-center ">

                                <Box sx={{margin:"0 auto",color:"#ba68c8"}}>
                                    <Typography>
                                        {showDetail.productName}
                                    </Typography>
                                </Box>

                                <Box className="box-detail-product" sx={{display: 'flex' , justifyContent: 'space-evenly' , margin : '20px'}}>

                                    <Box 
                                    
                                        sx={{ 
                                            bgcolor: 'text.disabled', 
                                            color: 'background.paper', 
                                            p: 2 , 
                                            borderRadius : "8px",
                                        }}>

                                        <Typography 
                                            id="modal-modal-title" variant="h6" component="h6"
                                            sx={{ 
                                                fontSize : "15px" , 
                                                color :"#fbc44a",
                                                border :"2px solid #383224fa", 
                                                padding : "5px", 
                                                borderRadius : "6px" , 
                                                margin : "5px"
                                            }}
                                        >
                                            <span>productName :</span>
                                            <span>{showDetail.productName}</span>
                                             
                                        </Typography>

                                        <Typography 
                                            id="modal-modal-title" variant="h6" component="h6"
                                            sx={{ 
                                                fontSize : "15px" , 
                                                color :"#fbc44a",
                                                border :"2px solid #383224fa", 
                                                padding : "5px", 
                                                borderRadius : "6px" , 
                                                margin : "5px"
                                            }}
                                        >
                                            brand : {brands.map((brand)=>(
                                                brand.id === showDetail.brandId?brand.brandName:""
                                                
                                            ))}
                                        </Typography>

                                        <Typography 
                                            id="modal-modal-title" variant="h6" component="h6"
                                            sx={{ 
                                                fontSize : "15px" , 
                                                color :"#fbc44a",
                                                border :"2px solid #383224fa", 
                                                padding : "5px", 
                                                borderRadius : "6px" , 
                                                margin : "5px"
                                            }}
                                        >
                                            category : {categories.map((category)=>(
                                                category.id === showDetail.categoryId?category.categoryName:"" 
                                            ))}
                                        </Typography>

                                        <Typography 
                                            id="modal-modal-title" 
                                            variant="h6" 
                                            component="h6"
                                            sx={{ 
                                                fontSize : "15px" , 
                                                color :"#fbc44a",
                                                border :"2px solid #383224fa", 
                                                padding : "5px", 
                                                borderRadius : "6px" , 
                                                margin : "5px"
                                            }}
                                        >
                                            <div className="flex">
                                                <span>Rating :</span>
                                                {"    "}
                                                <Stack spacing={1} className="flex justify-center">
                                                    <Rating name="half-rating-read" defaultValue={showDetail.rating} precision={showDetail.rating} size="small"/>
                                                </Stack>
                                            </div>
                                        
                                            
                                        </Typography>

                                        {showDetail.discount>0 ?
                                            <>
                                                <Typography 
                                                    id="modal-modal-title" variant="h6" component="h6"
                                                    sx={{ fontSize : "18px" ,textDecoration: 'line-through', color :"#fbc44a",border :"2px solid #383224fa", padding : "5px", borderRadius : "6px" , margin : "5px"}}
                                                >
                                                    price : {showDetail.price} 
                                                    {showDetail.discount>0?
                                                        <span className="w-10 mx-3 bg-amber-500 p-1 rounded no-underline text-white text-[11px]">
                                                            {showDetail.discount} %
                                                        </span>:null
                                                    }
                                                </Typography>
                                                <Typography 
                                                    id="modal-modal-title" variant="h6" component="h6"
                                                    sx={{ 
                                                        fontSize : "18px" , 
                                                        color :"#fbc44a",
                                                        border :"2px solid #383224fa", 
                                                        padding : "5px", 
                                                        borderRadius : "6px" , 
                                                        margin : "5px"
                                                    }}
                                                >
                                                    Discounted price : {showDetail.price-((showDetail.price)*(showDetail.discount/100))}
                                                </Typography>
                                            </>
                                        :

                                            <Typography 
                                                    id="modal-modal-title" variant="h6" component="h6"
                                                    sx={{ 
                                                        fontSize : "18px" , 
                                                        color :"#fbc44a",
                                                        border :"2px solid #383224fa",
                                                        padding : "5px", 
                                                        borderRadius : "6px" ,
                                                        margin : "5px"
                                                    }}
                                                >
                                                    price : {(showDetail.price)}
                                            </Typography>
                                        
                                        }

                                    </Box>

                                    <Box className="boxImage" sx={{ bgcolor: 'text.disabled', color: 'background.paper', p: 2 , width : 350 , borderRadius : "8px"}}>
                                        
                                        <Card sx={{ maxWidth: 900 }}>
                                            <CardMedia
                                                component="img"
                                                alt={`${showDetail.image}`}
                                                height={200}
                                                src={require(`../../images/${showDetail.image}`)}
                                                title={showDetail.productName}
                                            />
                                        </Card>

                                        {showDetail.discount>0 ?
                                            <div className="boxDiscount">
                                                <div className="productDiscount">
                                                <div className="discount">
                                                    <span >{showDetail.discount} %</span>
                                                </div>
                                            </div>
                                            </div>
                                        :null}
                                        
                                    </Box>

                                </Box>

                                <Button type="button" variant="contained"  sx={{width:"15%",margin:"0 auto",color:"#ffab00",background:"#424242"}}
                                    onClick={()=> handleClose()}
                                >
                                    Close
                                </Button>

                            </div>
                        </Box>
                </Modal> 
            :""}
            <ModalComponents showLoginMessage={showLoginMessage} hiddenLoginMessage={()=>(setShowLoginMessage())}>login</ModalComponents>
            <div className="main">
                <div className="header grid grid-cols-12 gap-2 z-[1000] px-1 py-2 bg-stone-900 rounded-lg border-[1px] border-stone-700 sticky top-[63px]">
                    <div className="title_store border-[2px] border-stone-700 rounded-lg col-span-2 ">
                        <h5 className="px-2 py-0.5 my-1 d-flex justify-between items-center text-orange-300">
                            <span>
                                Store{" "}<i className="fa fa-shopping-bag"></i> 
                            </span>
                            <span className="px-3 py-1 my-1 rounded-lg bg-neutral-700 text-orange-100 bg-gradient">
                                {productToShow.length}
                            </span>
                        </h5>
                    </div>
                    <div className="header-search col-span-10 w-6/12 py-2 mx-auto">
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
        
                <div className="main_product mx-auto sticky rounded-lg border-[2px] border-stone-800 mt-3 px-2">
                    
                    <div className="grid col-span-12 rounded-lg border-[2px] border-stone-800 mt-3 p-2">
                        <Slider productToShow={productToShow}/>
                    </div>

                    <div className="grid grid-cols-12 gap-4 py-2 content">
                        <div className="content_filter col-span-2 px-2 py-2 mt-3 h-fit bg-stone-800 rounded-lg ">
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
                        
                        <div className="content_products col-span-10 border-[1px] border-stone-900 rounded-lg p-2 m-2">
                            <div className="grid grid-cols-12 gap-1">
                                {productToShow.map((product) => (
                                    <Product
                                        key={product.id} 
                                        product={product} 
                                        onAddToCartClick={onAddToCartClick} 
                                        onDeletedToCartClick={onDeletedToCartClick}
                                        onShowDetailsProduct={showDetailsProduct}
                                    />
                                ))}
                            </div>

                            <Box className="w-1/2 h-10 m-auto border-[2px] border-stone-700 rounded-lg mt-4">
                                 <Stack spacing={2} className="relative mx-auto h-10 ">
                                    <Pagination count={10} variant="outlined" color="secondary" className="absolute m-auto w-full" />
                                </Stack>
                            </Box>

                           
                        </div>
                    </div>

                 
                </div>

            </div>  
        </>
    )
}

export default Store;