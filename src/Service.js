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