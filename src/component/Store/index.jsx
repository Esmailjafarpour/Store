import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../UserContext.js';
import {BrandsService,CategoriesService,ProductService,OrdersService,GetUser} from '../../Service.js';
import Product from '../Product';
import ModalComponents from '../ModalComponents/ModalComponents';
import Slider from '../Slider';
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
// import { request } from 'graphql-request';
import ReactPaginate from 'react-paginate';
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
    const [allState, setAllState] = useState({
        brands:[],
        categories:[],
        products:[],
        productToShow:[],
        search:"",
        showLoginMessage:false,
        postsPerPage : 3,
        currentPage : 1,
        open : false,
        showDetail : {
            id: "",
            productName: "",
            price: "",
            brandId: "",
            categoryId: "",
            rating: "",
            image: "",
            quantityInStock: ""   
        },
        resultBeforeOrder : []
    });    

    const indexOfLastPost = allState.currentPage * allState.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - allState.postsPerPage;
    const currentPosts = allState.productToShow.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = ({ selected }) => {
        setAllState(prev => ({
            ...prev,
            currentPage : selected+1
        }));
    };

    useEffect(() => {
        (async () => {
            let brandResponse = await BrandsService.fetchBrands();
            let brandResponseBody = await brandResponse.json();
            brandResponseBody.forEach((brand) => {
                brand.isChecked = true;
            }); 
           
            let categoriesResponse = await CategoriesService.fetchCategories();
            let categoriesResponseBody = await categoriesResponse.json();
            categoriesResponseBody.forEach((category) => {
                category.isChecked = true;
            });

            const fetchUserResponse = await GetUser.fetchUser();
            const fetchUserResponseBody = await fetchUserResponse.json();


            let productsResponse = await fetch(`http://localhost:5000/products?productName_like=${allState.search}`,{method:"GET"});
            let productsResponseBody = await productsResponse.json();
            if(productsResponse.ok){
                productsResponseBody.forEach((product) => {
                    product.brand = BrandsService.getBrandByBrandId(brandResponseBody,product.brandId)
                    product.category = CategoriesService.getCategoryByCategoryId(categoriesResponseBody,product.categoryId)
                    product.isOrdered = false;
                });
            }

            setAllState(prev=>({
                ...prev,
                brands : brandResponseBody,
                categories : categoriesResponseBody,
                resultBeforeOrder : fetchUserResponseBody.orders,
                products : productsResponseBody,
                productToShow : productsResponseBody,
            }))
            // setProductToShow(productsResponseBody);
            document.title = "Store"
            
            // setAllState(prev =>({
            //     ...prev ,
            //     brands : brandResponseBody
            // }))
            // setBrands(brandResponseBody);

            // setAllState(prev =>({
            //     ...prev ,
            //     categories : categoriesResponseBody
            // }))
            // setCategories(categoriesResponseBody);

            // setAllState(prev =>({
            //     ...prev ,
            //     resultBeforeOrder : ordersResponseBody,
            //     brands : brandResponseBody,
            //     categories : categoriesResponseBody

            //}))
            
            // setAllState(prev =>({
            //     ...prev ,
            //     products : productsResponseBody
            // }))
            // setProducts(productsResponseBody);
        })();
    },[allState.search,allState.currentPage,userContext.user.changeProduct]);


    useEffect(() => (
        userContext.dispatchBrands({
            type:"brands",
            payload:{
              brands : allState.brands  
            },
        })

    ), [allState.brands]);

    const updateBrandIsChecked = (id) => {
        let brandsData = allState.brands.map((brand)=>{
            if(brand.id === id) brand.isChecked = !brand.isChecked;
            return brand
        })
        setAllState(prev =>({
            ...prev ,
            brands : brandsData
        }))
        // setBrands(brandsData);
        updateProductToShow()
    }

    const updateCategoriesChecked = (id) => {
        let categoriesData = allState.categories.map((category)=>{
            if(category.id === id) category.isChecked = !category.isChecked;
            return category
        })
        setAllState(prev =>({
            ...prev ,
            categories : categoriesData
        }))
        // setCategories(categoriesData);
        updateProductToShow();
    }

    const updateProductToShow = () =>{
        let orderNumber = []
        setAllState(prev=>({
            ...prev,
            productToShow:allState.products
            .filter((prod) => {
                return allState.categories.filter((cat)=> cat.id === prod.categoryId && cat.isChecked).length > 0
            })
            .filter((prod) => {
                return allState.brands.filter((brand)=> brand.id === prod.brandId && brand.isChecked).length > 0
            })
        }))
        // setProductToShow(
            
        // )

        allState.products.map((product)=>orderNumber.push(product.quantity))
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
            setAllState((prev)=>({
                ...prev,
                showDetail : productsDetail,
                open : true
            }))
            // setShowDetail(productsDetail)
         }

        //  setAllState((prev)=>({
        //     ...prev,
        //     open : true
        //  }))
        
        //  setOpen(true)
    }

    const handleClose = () => (
        // setOpen(false),
        setAllState((prev)=>({
            ...prev,
            open : false,
            showDetail : {
                id: "",
                productName: "" ,
                price: "",
                brandId: "",
                categoryId: "",
                rating: "",
                image: "",
                quantityInStock: ""   
            }
        }))
        // setShowDetail({
        //     id: "",
        //     productName: "" ,
        //     price: "",
        //     brandId: "",
        //     categoryId: "",
        //     rating: "",
        //     image: "",
        //     quantityInStock: "" 
        // })
    );

    const checkLogin = () =>{
        setAllState(prev=>({
            ...prev,
            showLoginMessage : true
        }))
    }

    const totalOrders = async (value,num) => {
        const fetchUserResponse = await GetUser.fetchUser();
        const fetchUserResponseBody = await fetchUserResponse.json();
        let orderUser = fetchUserResponseBody.find(user => user.fullName === userContext.user.currentUserName)
        let totalOrders = 0
        if (value === "add") {
            orderUser.orders.forEach(order =>{
                totalOrders += num
             })
            userContext.dispatch({
                type:"login",
                payload:{
                    currentUserId : userContext.user.currentUserId,
                    currentUserName : userContext.user.currentUserName,
                    currentUserRole : userContext.user.currentUserRole,
                    totalOfOrders : totalOrders,
                    imageUser :userContext.user.imageUser,
                    hideShoppingCart : false
                }
            }) 
        }else{
            orderUser.orders.forEach(order =>{
                totalOrders -= num
            })
            userContext.dispatch({
                type:"login",
                payload:{
                    currentUserId : userContext.user.currentUserId,
                    currentUserName : userContext.user.currentUserName,
                    currentUserRole : userContext.user.currentUserRole,
                    totalOfOrders : Math.abs(totalOrders),
                    imageUser :userContext.user.imageUser,
                    hideShoppingCart : false
                }
            })  
        }
       
    }
   
    return(
        <>   
        
            {allState.showDetail.id !== "" ?
                <Modal
                    open={allState.open}
                    onClose={handleClose}
                    style={{backdropFilter: "blur(3px)"}}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                        <Box sx={style.styleBox} className="content-box2">
                            <Box className="w-100 flex flex-col justify-center ">
                                <Box sx={{margin:"0 auto",color:"#ba68c8"}}>
                                    <Typography
                                        variant="h6" component="h6"
                                    >
                                        {allState.showDetail.productName}
                                    </Typography>
                                </Box>
                                <Box className="box-detail-product" sx={{display: 'flex' , justifyContent: 'space-evenly' , margin : '20px'}}>
                                    <Box 
                                        sx={{ 
                                            bgcolor: 'text.disabled', 
                                            color: 'background.paper', 
                                            p: 2 , 
                                            borderRadius : "8px",
                                            display : "flex",
                                            justifyContent : "center",
                                            alignItem : "center",
                                            flexDirection : "column"
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
                                            <span>{allState.showDetail.productName}</span>
                                             
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
                                            brand : {allState.brands.map((brand)=>(
                                                brand.id === allState.showDetail.brandId?brand.brandName:""
                                                
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
                                            category : {allState.categories.map((category)=>(
                                                category.id === allState.showDetail.categoryId?category.categoryName:"" 
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
                                            <Box className="flex">
                                                <span>Rating :</span>
                                                {"    "}
                                                <Stack spacing={1} className="flex justify-center">
                                                    <Rating name="half-rating-read" defaultValue={allState.showDetail.rating} precision={allState.showDetail.rating} size="small"/>
                                                </Stack>
                                            </Box>
                                        </Typography>
                                        {allState.showDetail.discount>0 ?
                                            <>
                                                <Typography 
                                                    id="modal-modal-title" variant="h6" component="h6"
                                                    sx={{ fontSize : "18px" ,textDecoration: 'line-through', color :"#fbc44a",border :"2px solid #383224fa", padding : "5px", borderRadius : "6px" , margin : "5px"}}
                                                >
                                                    price : {allState.showDetail.price} 
                                                    {allState.showDetail.discount>0?
                                                        <span className="w-10 mx-3 bg-amber-500 p-1 rounded no-underline text-white text-[11px]">
                                                            {allState.showDetail.discount} %
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
                                                    Discounted price : {allState.showDetail.price-((allState.showDetail.price)*(allState.showDetail.discount/100))}
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
                                                    price : {(allState.showDetail.price)}
                                            </Typography>
                                        }
                                    </Box>
                                    <Box className="boxImage" 
                                        sx={{ 
                                            bgcolor: 'text.disabled', 
                                            color: 'background.paper', 
                                            p: 2 , 
                                            width : 350 , 
                                            borderRadius : "8px",
                                            display : "flex",
                                            justifyContent : "center",
                                            alignItem : "center",
                                            flexDirection : "column"
                                            }}
                                    >
                                        <Card sx={{ maxWidth: 900 }}>
                                            <CardMedia
                                                component="img"
                                                alt={`${allState.showDetail.image}`}
                                                height={200}
                                                src={require(`../../images/${allState.showDetail.image}`)}
                                                title={allState.showDetail.productName}
                                            />
                                        </Card>
                                        {allState.showDetail.discount>0 ?
                                            <Box className="boxDiscount">
                                                <Box className="productDiscount">
                                                <Box className="discount">
                                                    <span >{allState.showDetail.discount} %</span>
                                                </Box>
                                            </Box>
                                            </Box>
                                        :null}
                                    </Box>
                                </Box>
                                <Button type="button" variant="contained"  sx={{width:"15%",margin:"0 auto",color:"#ffab00",background:"#424242"}}
                                    onClick={()=> handleClose()}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
                </Modal> 
            :""}

            <ModalComponents 
                showLoginMessage={allState.showLoginMessage} 
                hiddenLoginMessage={()=>(setAllState(prev=>({
                    ...prev,
                    showLoginMessage : false
                })))}>
                    login
            </ModalComponents>

            <Box className="main">
                <Box className="header grid grid-cols-12 gap-2 z-[1000] px-1 py-2 bg-stone-900 rounded-lg border-[1px] border-stone-700 sticky top-[63px]">
                    <Box className="title_store border-[2px] border-stone-700 rounded-lg col-span-2 ">
                        <Typography 
                            variant="h5" component="h5"
                            className="px-2 py-0.5 my-1 d-flex justify-between items-center text-orange-300">
                            <span>
                                Store{" "}<i className="fa fa-shopping-bag"></i> 
                            </span>
                            <span className="px-3 py-1 my-1 rounded-lg bg-neutral-700 text-orange-100 bg-gradient">
                                {allState.productToShow.length}
                            </span>
                        </Typography>
                    </Box>
                    <Box className="header-search col-span-10 w-6/12 py-2 mx-auto">
                        <input  
                            type="search"
                            value={allState.search}
                            placeholder="Search Product"
                            className="bg-stone-700 w-full px-3 py-1.5 text-orange-100 rounded border-2 
                                border-solid border-slate-700 focus:text-orange-100 focus:outline-none
                                font-normal transition ease-in-out mx-auto"
                            autoFocus="autofocus"
                            onChange={(e)=>{setAllState(prev=>({
                                ...prev,
                                search : e.target.value
                            }))}}
                        />
                    </Box>
                </Box>
                <Box className="main_product mx-auto sticky rounded-lg border-[2px] border-stone-800 mt-3 px-2">
                    <Box className="flex gap-3 flex-row-reverse">
                        <Box className="carousel grid col-span-12 rounded-lg border-[2px] border-stone-800 mt-3 p-2 w-3/4">
                            <Slider products={allState.products} productToShow={allState.productToShow}/>
                        </Box>

                        <Box className="favorites w-1/4 rounded-lg border-[2px] border-stone-800 mt-3 p-2 max-h-[33rem]">
                            <Typography 
                                variant="h6" component="h6"
                                className="px-2 py-4 my-1 d-flex justify-center items-center text-orange-600 w-100">
                               Products with the most points
                            </Typography>
                            <ul className="p-0 m-0">
                                <Box className="flex justify-content gap-2 flex-col m-auto">
                                    {allState.products.map((product)=>(
                                        <>
                                            {product.rating === 5?
                                                <li className="rounded-lg border-[2px] border-stone-800 relative">
                                                    <Typography 
                                                        variant="h6" component="h6"
                                                        sx={{color:"#ffffffff"}}
                                                        className="px-2 py-4 my-1 d-flex justify-center items-center w-100 absolute top-8 opacity-80 -rotate-12">
                                                        {product.productName}
                                                    </Typography>
                                                    <Box className="overflow-hidden rounded-full ">
                                                        <img className="w-70" src={require(`../../images/${product.image}`)} alt="" />
                                                    </Box>
                                                </li>  
                                            :""}
                                        </>
                                    ))} 
                                </Box>
                            </ul>
                            {/* <li>
                            <img  src={require(`../../images/${product.image}`)} alt="" />
                            </li> */}
                        </Box>

                    </Box>
                    
                    <Box className="grid grid-cols-12 gap-4 py-2 content">
                        <Box className="content_filter col-span-2 px-2 py-2 mt-3 h-fit bg-stone-800 rounded-lg ">
                            <Box className="my-1">
                                <Typography className="text-amber-100 px-2">Brands</Typography>
                                <ul className="list-group list-group-flush">
                                    {allState.brands.map((brand)=>(
                                        <li className="px-2 py-2 my-1 bg-neutral-700 text-emerald-100 rounded-lg shadow-3xl border-yellow-900" key={brand.id}>
                                            <Box className="form-check">
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
                                            </Box>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                            <Box className="my-2">
                                <Typography className="text-amber-100 px-2">Categories</Typography>
                                <ul className="list-group list-group-flush">
                                    {allState.categories.map((category)=>(
                                        <li className="px-2 py-2 my-1 bg-neutral-700 text-emerald-100 rounded-lg shadow-3xl border-yellow-900" key={category.id}>
                                            <Box className="form-check">
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
                                            </Box>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </Box>
                        <Box className="content_products col-span-10 border-[1px] border-stone-900 rounded-lg p-2 m-2">
                            <Box className="w-fit px-2 py-1 m-auto border-[2px] border-stone-700 rounded-lg mt-4">
                                {allState.productToShow ? (
                                    <Box className="grid">
                                        <Box className="grid grid-cols-12 gap-1">
                                            {currentPosts.map((product) => (
                                                <Product
                                                    key={product.id} 
                                                    product={product}  
                                                    onShowDetailsProduct={showDetailsProduct}
                                                    onCheckLogin={checkLogin}
                                                    totalOrders={totalOrders}
                                                />
                                            ))}
                                        </Box>
                                        
                                        <Box className="w-fit px-2 py-1 mx-auto border-[2px] border-stone-700 rounded-lg my-3">
                                            <ReactPaginate
                                                onPageChange={paginate}
                                                pageCount={Math.ceil(allState.productToShow.length / allState.postsPerPage)}
                                                previousLabel={'Prev'}
                                                nextLabel={'Next'}
                                                containerClassName={'pagination'}
                                                pageLinkClassName={'page-number'}
                                                previousLinkClassName={'page-number'}
                                                nextLinkClassName={'page-number'}
                                                activeLinkClassName={'active'}
                                            />
                                        </Box>

                                    </Box>
                                 ) : (
                                    <Box className="loading">Loading...</Box>
                                )} 
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>  
        </>
    )
}

export default Store;


// const [brands, setBrands] = useState([]);
// const [categories, setCategories] = useState([]);
// const [products, setProducts] = useState([]);
// const [productToShow, setProductToShow] = useState([]);
// const [search, setSearch] = useState('');
// const [productsId,setProductsId] = useState([]);
// const [showLoginMessage ,setShowLoginMessage ] = useState(false);
// const [blogPosts, setBlogPosts] = useState([]);
// const [currentPage, setCurrentPage] = useState(1);
// const [postsPerPage] = useState(3);
// const [y, setY] = useState(window.scrollY);
// const [open, setOpen] = React.useState(false);
// const [showDetail, setShowDetail] = React.useState({
//     id: "",
//     productName: "",
//     price: "",
//     brandId: "",
//     categoryId: "",
//     rating: "",
//     image: "",
//     quantityInStock: "" 
// });




// let num = 0;
                // let prods = allState.products.map((p) =>{
                //     if (p.id === product.id){
                //         p.isOrdered = true;
                //         p.quantity = ++num
                //         p.quantityInStock = -- p.quantityInStock
                //         newOrder.quantity = ++num
                //     }
                //     return p
                // })

                // if(orderResponse.ok){
                //     let orderResponseBody = await orderResponse.json();
                //     setAllState(prev =>({
                //         ...prev ,
                //         products : prods
                //     }))
                //     // setProducts(prods);
                //     updateProductToShow();
                // }

                 // let prods = allState.products.map((p) =>{
        //     (async () => {
        //         if (p.id === product.id){
        //             product.quantity = ++product.quantity;
        //             product.quantityInStock = -- product.quantityInStock 
        //             let updateProduct = {
        //                 userId: userContext.user.currentUserId,
        //                 productId: product.id,
        //                 quantity: product.quantity,
        //                 isPaymentCompleted: false,
        //                 imageProduct: product.image,   
        //             }
        //             let orderResponse = await fetch(`http://localhost:5000/orders/${product.id}`,{
        //                 method:"PUT",
        //                 headers:{"Content-Type":"application/json"},
        //                 body : JSON.stringify(updateProduct)
        //             })
        //             let orderResponseBody = await orderResponse.json()
        //             // return orderResponseBody
        //         }       
        //     })()
        //     return p
        // })
        // setAllState(prev =>({
        //     ...prev ,
        //     products : prods
        // }))

        // // setProducts(prods);
        // updateProductToShow();
        // return
            
         
        //     (async ()=>{
        //         let newOrder = {
        //             userId : userContext.user.currentUserId,
        //             productId : product.id,
        //             quantity : 0,
        //             isPaymentCompleted : false,
        //             imageProduct:product.image
        //         };
    
        //         let num = 0;
        //         let prods = allState.products.map((p) =>{
        //             if (p.id === product.id){
        //                 p.isOrdered = true;
        //                 p.quantity = ++num
        //                 p.quantityInStock = -- p.quantityInStock
        //                 newOrder.quantity = ++num
        //             }
        //             return p
        //         })
            
        //         let orderResponse = await fetch(`http://localhost:5000/orders`,{
        //             method : "POST",
        //             body : JSON.stringify(newOrder),
        //             headers:{"Content-Type":"application/json"}
        //         })
    
        //         if(orderResponse.ok){
        //             let orderResponseBody = await orderResponse.json();
        //             setAllState(prev =>({
        //                 ...prev ,
        //                 products : prods
        //             }))
        //             // setProducts(prods);
        //             updateProductToShow();
        //         }
        //     })()

        // createNewOrder(product);
    