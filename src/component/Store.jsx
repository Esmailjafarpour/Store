import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../UserContext.js';
import {BrandsService,CategoriesService} from '../Service.js';

const Store = () => {

    const userContext = useContext(UserContext);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    console.log(brands)
    console.log(categories)

    useEffect(() => {

        (async () => {

            let brandResponse = await BrandsService.fetchBrands();
            if(brandResponse.ok){
                let brandResponseBody = await brandResponse.json();
                brandResponseBody.forEach((brand) => {
                    brand.isChecked = true;
                });
                setBrands(brandResponseBody);
            }

            let categoriesResponse = await CategoriesService.fetchCategories();
            if(categoriesResponse.ok){
                let categoriesResponseBody = await categoriesResponse.json();
                categoriesResponseBody.forEach((category) => {
                    category.isChecked = true;
                });
                setCategories(categoriesResponseBody);
            }
            
        })();

    },[]);

    const updateBrandIsChecked = (id) => {
        let brandsData = brands.map((brand)=>{
            if(brand.id === id) brand.isChecked = !brand.isChecked;
            return brand
        })

        setBrands(brandsData)
    }

    const updateCategoriesChecked = (id) => {
        let categoriesData = categories.map((category)=>{
            if(category.id === id) category.isChecked = !category.isChecked;
            return category
        })

        setCategories(categoriesData)
    }

    return(
        <div>
            <div className="row py-3 header">
                <div className="col-lg-3">
                    <h4><i className="fa fa-shopping-bag"></i>Store</h4>
                </div>
                <div className="row">
                    <div className="col-lg-3 py-2">
                         <div className="my-2">
                            <h5>Brands</h5>
                            <ul className="list-group list-group-flush">
                                {brands.map((brand)=>(
                                    <li className="list-group-item" key={brand.id}>
                                        <div className="form-check">
                                            <input 
                                                type="checkBox" 
                                                className="form-check-input"
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
                            <h5>Categories</h5>
                            <ul className="list-group list-group-flush">
                                {categories.map((category)=>(
                                    <li className="list-group-item" key={category.id}>
                                        <div className="form-check">
                                            <input 
                                                type="checkBox" 
                                                className="form-check-input"
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
                </div>
            </div>
        </div>
    )
}

export default Store;