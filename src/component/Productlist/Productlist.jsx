import React,{useState,useEffect,useContext,useMemo} from 'react';
import {UserContext} from '../../UserContext.js';
import {BrandsService,CategoriesService,ProductService,SortService} from '../../Service.js';
import {NavLink,useNavigate} from 'react-router-dom';
import NewProduct from '../NewProduct/NewProduct';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./productlist.css";

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
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('productName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [originalProducts, setOriginalProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showNewProduct, setShowNewProduct] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => (
        setOpen(false)
      );

    useEffect(() => {
        if(userContext.user.role === "user") {
            setOpen(true)
        }
    }, []);

    useEffect(() => {
        (async () => {
            let brandsResponse = await BrandsService.fetchBrands()
            let brandsResponseBody = await brandsResponse.json();
            setBrands(brandsResponseBody);

            let categoriesResponse = await CategoriesService.fetchCategories()
            let categoriesResponseBody = await categoriesResponse.json();
            setCategories(categoriesResponseBody)

            let productsResponse = await fetch(
                `http://localhost:5000/products?productName_like=${search}&_sort=productName&_order=ASC`,{method:"GET"}
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

            setProducts(productsResponseBody);
            setOriginalProducts(productsResponseBody);

        })();
        document.title = "Productlist"
    },[search]);

    const onSortColumnNameClick = (e,columnName) =>{
        e.preventDefault()
        setSortBy(columnName)
        const negatedSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(negatedSortOrder)
        setProducts(SortService.getSortArray(originalProducts,columnName,negatedSortOrder))
    }

    const filterProductsByBrand = useMemo(() => {
        return originalProducts.filter(
            (prod) => prod.brand.brandName.indexOf(selectedBrand) >= 0
        )
    },[originalProducts,selectedBrand,])


    const filterProductsByCategory = useMemo(() => {
    
        return originalProducts.filter(
            (prod) => prod.category.categoryName.indexOf(selectedCategory) >= 0
        )
    },[originalProducts,selectedCategory])
    

    useEffect(() => {
        setProducts(SortService.getSortArray(filterProductsByBrand,sortBy,sortOrder));
        // setCategories([]);
    }, [filterProductsByBrand,sortBy,sortOrder]);

    useEffect(() => {
        setProducts(SortService.getSortArray(filterProductsByCategory,sortBy,sortOrder));
        // setBrands([]);
    }, [filterProductsByCategory,sortBy,sortOrder]);


    const getColumnHeader = (columnName,displayName) =>{
        return(
            <>
                <a 
                    href="/#"
                    onClick={(e)=>{onSortColumnNameClick(e,columnName)}}
                    className="link-table link-warning"
                >{displayName}{" "}</a>
                
                {sortBy === columnName && sortOrder === "asc" ?
                (<i className="fa fa-sort-up link-table"></i>):("")}

                {sortBy === columnName && sortOrder === "desc" ?
                (<i className="fa fa-sort-down link-table"></i>):("")}
            </>
        )
    }

    return(
        <Box className="grid grid-rows-12">
            <Modal
                open={open}
                style={{backdropFilter: "blur(30px)"}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                    <Box sx={style} className="content-box2">
                        <Box className="w-100 flex flex-col justify-center">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
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
                                <span className="badge bg-secondary bage-header">{products.length}</span>
                            </h4>
                            <input 
                                type="search" 
                                value={search}
                                onChange={(e)=>{setSearch(e.target.value)}}
                                placeholder="Search"
                                className="form-control input-search col-span-6"
                                autoFocus="autofocus"
                            />
                            <button type="button" className="createNewProduct focus:outline-none text-white bg-green-900 hover:bg-green-800 
                                focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 mx-2 mb-1 
                                dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 col-span-3"
                                onClick={()=> setShowNewProduct(true)}
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
                                value={selectedBrand}
                                onChange={(e)=>{
                                    setSelectedBrand(e.target.value)
                                }} 
                                className="form-control selected"
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand)=>{
                                    return <option value={brand.brandName} key={brand.id}>{brand.brandName}</option>
                                })}
                            </select>
                        </Box>
                        <Box className="col-span-6">
                            <select 
                                value={selectedCategory}
                                onChange={(e)=>{
                                    setSelectedCategory(e.target.value)
                                }} 
                                className="form-control selected"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category)=>{
                                    return <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                                })}
                            </select>
                        </Box>
                    </Box>
                </Box>
                
            </Box>
            <Box className="grid-cols-12 m-3 p-2 tableProductStore">
                <NewProduct showNewProduct={showNewProduct} hiddenNewProduct={()=> setShowNewProduct(false)}/>
                <Box className="content-table border-[2px] border-yellow-700 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-700  my-1 shadow">
                    <Box className="table-product p-2 rounded-xl">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>{getColumnHeader("productName","ProductName")}</th>
                                    <th>{getColumnHeader("price","Price")}</th>
                                    <th>{getColumnHeader("brand.brandName","Brand")}</th>
                                    <th>{getColumnHeader("category.categoryName","Category")}</th>
                                    <th>{getColumnHeader("rating","Rating")}</th>
                                </tr>
                            </thead>
                            <tbody className="tbody-product">
                                {products.map((product)=>{
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