export const OrdersService = {
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