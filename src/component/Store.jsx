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

    return(
        <div>Store</div>
    )
}

export default Store;