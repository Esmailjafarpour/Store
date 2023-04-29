import React,{useState,useEffect,useContext,useMemo} from 'react';
import {UserContext} from '../../UserContext.js';
import {BrandsService,CategoriesService,ProductService,SortService} from '../../Service.js';
import {NavLink,useNavigate} from 'react-router-dom';
import NewProduct from '../NewProduct';
import EditProduct from '../EditProduct';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./style.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#201f1f',
    border: '2px solid #808080',
    borderRadius: '16px',
    color :"#ffffff",
    boxShadow: 24,
    p: 2,
  };


const Productlist = () => {
    const userContext = useContext(UserContext);
    const [allState, setAllState] = useState({
        products : [],
        removedProducts : false,
        productEditData : {},
        search : '',
        sortBy : 'productName',
        sortOrder : 'asc',
        originalProducts : [],
        brands : [] ,
        selectedBrand : "",
        categories : [] ,
        selectedCategory : "",
        showNewProduct : false,
        showEditProduct : false,
        showModal : false,
        open : false ,
        changeProduct : false
    });
   
    const handleClose = () => (
        setAllState(prev => ({
            ...prev,
            open : false
        }))
        // setOpen(false)
        );
        
     
    useEffect(() => {
        if(userContext.user.role === "user") {
            setAllState(prev => ({
                ...prev,
                open : true
            }))
            // setOpen(true)
        }
    }, []);

    useEffect(() => {
        (async () => {
            let brandsResponse = await BrandsService.fetchBrands()
            let brandsResponseBody = await brandsResponse.json();

            let categoriesResponse = await CategoriesService.fetchCategories()
            let categoriesResponseBody = await categoriesResponse.json();

            let productsResponse = await fetch(
                `http://localhost:5000/products?productName_like=${allState.search}&_sort=productName&_order=ASC`,{method:"GET"}
                );
            let productsResponseBody = await productsResponse.json();

            productsResponseBody.forEach((product) => {

                product.brand = BrandsService.getBrandByBrandId(
                    brandsResponseBody,
                    product.brandId
                )

                product.category = CategoriesService.getCategoryByCategoryId(
                    categoriesResponseBody,
                    product.categoryId
                )

                product.isOrdered = false;

            });

            setAllState((prev)=>({
                ...prev,
                brands : brandsResponseBody,
                categories : categoriesResponseBody,
                products: productsResponseBody,
                originalProducts : productsResponseBody,

            }))

            // setAllState(prev => ({
            //     ...prev,
            //     brands : brandsResponseBody
            // }))
            // // setBrands(brandsResponseBody);

            // setAllState(prev => ({
            //     ...prev,
            //     categories : categoriesResponseBody
            // }))
            // setCategories(categoriesResponseBody);

            // setProducts(productsResponseBody);
            // setOriginalProducts(productsResponseBody);

        })();
        document.title = "Productlist"
    },[allState.search,allState.removedProducts,allState.showNewProduct,allState.productEditData]);

    
    const onSortColumnNameClick = (e,columnName) =>{
        e.preventDefault()
        const negatedSortOrder = allState.sortOrder === "asc" ? "desc" : "asc";
        setAllState((prev)=>({
            ...prev,
            products: SortService.getSortArray(allState.originalProducts,columnName,negatedSortOrder),
            sortBy : columnName,
            sortOrder : negatedSortOrder
        }))

        // setAllState(prev => ({
        //     ...prev,
        //     sortBy : columnName
        // }))
        // setSortBy(columnName)
        // setSortOrder(negatedSortOrder)
        // setProducts(SortService.getSortArray(originalProducts,columnName,negatedSortOrder))
    }

    const filterProductsByBrand = useMemo(() => {
        return allState.originalProducts.filter(
            (prod) => prod.brand.brandName.indexOf(allState.selectedBrand) >= 0
        )
    },[allState.originalProducts,allState.selectedBrand,])


    const filterProductsByCategory = useMemo(() => {
        return allState.originalProducts.filter(
            (prod) => prod.category.categoryName.indexOf(allState.selectedCategory) >= 0
        )
    },[allState.originalProducts,allState.selectedCategory])
    

    useEffect(() => {
        setAllState((prev)=>({
            ...prev,
            products: SortService.getSortArray(filterProductsByCategory,allState.sortBy,allState.sortOrder)
        }))
        // setProducts(SortService.getSortArray(filterProductsByCategory,sortBy,sortOrder));
        // setBrands([]);
    }, [filterProductsByCategory,allState.sortBy,allState.sortOrder]);

    useEffect(() => {
        setAllState((prev)=>({
            ...prev,
            products: SortService.getSortArray(filterProductsByBrand,allState.sortBy,allState.sortOrder)
        }))
        // setProducts(SortService.getSortArray(filterProductsByBrand,sortBy,sortOrder));
        // setCategories([]);
    }, [filterProductsByBrand,allState.sortBy,allState.sortOrder]);


    const getColumnHeader = (columnName,displayName) =>{
        return(
            <>
                <a 
                    href="/#"
                    onClick={(e)=>{onSortColumnNameClick(e,columnName)}}
                    className="link-table link-warning"
                >{displayName}{" "}
                </a>
                
                {allState.sortBy === columnName && allState.sortOrder === "asc" ?
                (<i className="fa fa-sort-up link-table"></i>):("")}

                {allState.sortBy === columnName && allState.sortOrder === "desc" ?
                (<i className="fa fa-sort-down link-table"></i>):("")}
            </>
        )
    }

    let onDeletedProduct = async(product)=>{
        if (window.confirm(`Are you sure to delete ${product.productName} from Products?`)) {
            let productResponse = await fetch(`http://localhost:5000/products/${product.id}`,{method : "DELETE"})
            if (productResponse.ok) {
                setAllState(prev => ({
                    ...prev,
                    removedProducts: !allState.removedProducts
                }))
                // setRemovedProducts(!removedProducts)
            }
        }     
    }
    
    let onEditProduct = async (product) => {
        setAllState(prev => ({
            ...prev,
            productEditData : product,
            showEditProduct : true
        }))
       
        // setShowEditProduct(true)
        // setAllState(prev => ({
        //     ...prev,
        //     // productEditData : product
        // }))
        // setProductEditData(product)
    }

    return(
        <Box className="grid grid-rows-12">
            <Modal
                open={allState.open}
                style={{backdropFilter: "blur(30px)"}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                    <Box sx={style} className="content-box2">
                        <Box className="w-100 flex flex-col justify-center">
                            <Typography id="modal-modal-title" variant="h6" component="h6">
                                This page is related to the admin. If you are an admin, please login
                            </Typography>

                            <button type="button" className="numberShoppingCart text-green-300 border-2 border-neutral-600
                                        focus:outline-none rounded-lg text-sm px-1 text-center bg-gradient
                                        mr-2 my-2 mx-auto w-50 dark:hover:text-green-900 dark:hover:bg-green-200 rounded-full px-2 py-2">
                                <NavLink className="nav-link text-green-600 p-2" activeclassname="active" aria-current="page" to="/login">
                                     Login
                                </NavLink>
                            </button>
                        </Box>
                    </Box>
            </Modal> 
            <Box className="grid grid-cols-12 p-3 gap-3 border-amber-500 rounded-lg mt-2">
                <Box className="numberProduct_search col-span-8">
                    <Box className="grid grid-cols-12">
                            <h4 className="col-span-3 text-orange-300 mb-3">
                                <i className="fa fa-suitcase"></i>Products{"  "}
                                <span className="badge bg-secondary bage-header">{allState.products.length}</span>
                            </h4>
                            <input 
                                type="search" 
                                value={allState.search}
                                onChange={(e)=>{
                                    setAllState(prev => ({...prev,search : e.target.value}))
                                    // setSearch(e.target.value)
                                }}
                                placeholder="Search"
                                className="form-control input-search col-span-6"
                                autoFocus="autofocus"
                            />
                            <button type="button" className="createNewProduct focus:outline-none text-white bg-green-900 hover:bg-green-800 
                                focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 mx-2 mb-1 
                                dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 col-span-3"
                                onClick={()=> 
                                    setAllState(prev => ({
                                        ...prev,
                                        showNewProduct : true
                                    }))
                                    // setShowNewProduct(true)
                                }
                                >
                                <NavLink className="nav-link" activeclassname="active" aria-current="page" to="#!">
                                    Create New Product
                                </NavLink>
                            </button>
                    </Box>
                </Box>
                <Box className="SortByCategory col-span-4">
                    <Box className="grid grid-cols-12 gap-2">
                        <Box className="col-span-6">
                            <select 
                                value={allState.selectedBrand}
                                onChange={(e)=>{
                                    setAllState(prev => ({
                                        ...prev,
                                        selectedBrand : e.target.value
                                    }))
                                    // setSelectedBrand(e.target.value)
                                }} 
                                className="form-control selected"
                            >
                                <option value="">All Brands</option>
                                {allState.brands.map((brand)=>{
                                    return <option value={brand.brandName} key={brand.id}>{brand.brandName}</option>
                                })}
                            </select>
                        </Box>
                        <Box className="col-span-6">
                            <select 
                                value={allState.selectedCategory}
                                onChange={(e)=>{
                                    setAllState(prev => ({
                                        ...prev,
                                        selectedCategory : e.target.value
                                    }))
                                    // setSelectedCategory(e.target.value)
                                }} 
                                className="form-control selected"
                            >
                                <option value="">All Categories</option>
                                {allState.categories.map((category)=>{
                                    return <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                                })}
                            </select>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className="grid-cols-12 m-3 p-2 tableProductStore">
                <NewProduct 
                    showNewProduct={allState.showNewProduct} 
                    hiddenNewProduct={()=> 
                        setAllState(prev => ({
                            ...prev,
                            showNewProduct : false
                        }))
                        // setShowNewProduct(false)
                    }
                    />
                <EditProduct 
                    productEditData={allState.productEditData} 
                    showEditProduct={allState.showEditProduct} 
                    hiddenEditProduct={()=> 
                    setAllState(prev =>({
                         ...prev,
                        showEditProduct : false  
                    })   
                    )
                    // setShowEditProduct(false)
                }
                />
                <Box className="content-table border-[2px] border-yellow-700 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-700  my-1 shadow">
                    <Box className="table-product p-2 rounded-xl">
                        <table className="table table-dark table-striped">
                            <thead className="head-product">
                                <tr>
                                    <th>{getColumnHeader("productName","ProductName")}</th>
                                    <th>{getColumnHeader("price","Price")}</th>
                                    <th>{getColumnHeader("brand.brandName","Brand")}</th>
                                    <th>{getColumnHeader("category.categoryName","Category")}</th>
                                    <th>{getColumnHeader("rating","Rating")}</th>
                                    <th className="link-table link-warning font-bold">Image</th>
                                    <td className="link-table link-warning font-bold ">
                                        <img src={require("../../images/edited-64.png")} style={{width:"35px" , margin : "0 12px"}} />
                                    </td>
                                    <td className="link-table link-warning font-bold ">
                                        <img src={require("../../images/remove-64.png")} style={{width:"35px", margin : "0 12px"}} />
                                    </td>
                                </tr>
                            </thead>
                            <tbody className="tbody-product">
                                {allState.products.map((product)=>{
                                    return(
                                        <tr key={product.id}>
                                            <td className="productName">{product.productName}</td>
                                            <td>{product.price}</td>
                                            <td>{product.brand.brandName}</td>
                                            <td>{product.category.categoryName}</td>
                                            <td className="rating_star">
                                                {[...Array(product.rating).keys()].map((n)=>{
                                                    return <i className="fa fa-star text-warning" key={n}></i>
                                                })}
                                                {[...Array(5-product.rating).keys()].map((n)=>{
                                                    return <i className="fa fa-star-o text-warning" key={n}></i>
                                                })}
                                            </td>
                                            <td className="imgProduct">
                                                <img src={require(`../../images/${product.image}`)} alt="" />
                                            </td>
                                            <td>
                                                <Button 
                                                    color="success"
                                                    onClick={()=>onEditProduct(product)}
                                                    >
                                                        <img src={require("../../images/edit.png")} style={{width:"25px"}} />
                                                    </Button>
                                            </td>
                                            <td>
                                                <Button 
                                                    color='warning'
                                                    onClick={()=>onDeletedProduct(product)}>
                                                    <img src={require("../../images/trash.png")} style={{width:"25px"}} />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Productlist;


 // const [products, setProducts] = useState([]);
// const [removedProducts, setRemovedProducts] = useState(false);
// const [productEditData, setProductEditData] = useState({});
// const [search, setSearch] = useState('');
// const [sortBy, setSortBy] = useState('productName');
// const [sortOrder, setSortOrder] = useState('asc');
// const [originalProducts, setOriginalProducts] = useState([]);
// const [brands, setBrands] = useState([]);
// const [selectedBrand, setSelectedBrand] = useState("");
// const [categories, setCategories] = useState([]);
// const [selectedCategory, setSelectedCategory] = useState("");
// const [showNewProduct, setShowNewProduct] = useState(false);
// const [showEditProduct, setShowEditProduct] = useState(false);
// const [showModal, setShowModal] = useState(false);
// const [open, setOpen] = React.useState(false);