import React,{useState,useEffect,useContext,useMemo} from 'react';
import {UserContext} from '../UserContext.js';
import {BrandsService,CategoriesService,ProductService,SortService} from '../Service.js';
import {NavLink,useNavigate} from 'react-router-dom';
import NewProduct from './NewProduct';

const Productlist = () => {
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
        <div className="grid grid-rows-12">
            <div className="grid grid-cols-12 p-3 gap-3 border-amber-500 rounded-lg mt-2">
                <div className="numberProduct_search col-span-8">
                    <div className="grid grid-cols-12">
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
                    </div>
                </div>
                <div className="SortByCategory col-span-4">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6">
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
                        </div>
                        <div className="col-span-6">
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
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="grid-cols-12 m-3 p-2">
                <NewProduct showNewProduct={showNewProduct} hiddenNewProduct={()=> setShowNewProduct(false)}/>
                <div className="border-[2px] border-yellow-700 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-700  my-1 shadow">
                    <div className="p-2 rounded-xl">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Productlist;