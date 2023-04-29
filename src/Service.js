import _ from "lodash";

export const GetUser = {
    fetchUser : () => {
        return fetch("http://localhost:5000/users",{method:"GET"});
    }
}

export const OrdersService = {
    // fetchOrders : () => {
    //     return fetch("http://localhost:5000/orders",{method:"GET"});
    //  },
 
    getPreviousOrders : (orders) => {
        return orders.filter((order)=>order.isPaymentCompleted === true)
    },
    getCart : (orders) => {
        return orders.filter((order)=>order.isPaymentCompleted === false)
    }
}

export const ProductService = {
    getProductByProductId : (products,productId) => {
       return products.find((product)=> product.id === productId)
    },
    fetchProducts : () => {
        return fetch("http://localhost:5000/products",{method:"GET"})
    }
}

export const BrandsService = {
    fetchBrands : () => {
       return fetch("http://localhost:5000/brands",{method:"GET"});
    },

    getBrandByBrandId : (brands,brandId) => {
        return brands.find((brand)=>(brand.id === brandId))
    }
};

export const CategoriesService = {
    fetchCategories : () => {
       return fetch("http://localhost:5000/categories",{method:"GET"});
    },

    getCategoryByCategoryId : (categories,categoryId) => {
        return categories.find((category)=>(category.id === categoryId))
    }
};

export const SortService = {
    getSortArray : (elements,sortBy,sortOrder) => {
        if(!elements) return elements;
        
        let array = [...elements];

        const sortedArray = _.orderBy(array,[sortBy],[sortOrder])

        return sortedArray
    }
}



