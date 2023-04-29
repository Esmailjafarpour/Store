import React,{useState,useEffect,useContext} from 'react';
import Box from '@mui/material/Box';
import {UserContext} from '../../UserContext.js';
import {OrdersService,GetUser} from '../../Service.js';


const ProductOrderRegistration = (
    {
        product,
        orderQuantity,
        onCheckLogin,
        currentUser,
        AddOrder,
        OrderReduction,
        hiddenAddToCard
        // quantityInStock,
        // showChange,
    }) => {

    const userContext = useContext(UserContext);
    const [allState, setAllState] = useState({
        // color : "",
        // totalOrders : [],
        // showOrder : false,
        // resultBeforeOrder : [],
        quantityInStock : product.quantityInStock,
        currentUser : [],
        orderQuantity : orderQuantity
    });

    useEffect(() => {
        
        (async ()=>{

            // const ordersResponse = await OrdersService.fetchOrders();
            // const ordersResponseBody = await ordersResponse.json();
            // let beforeOrders = ordersResponseBody.filter((order)=>(
            //     order.productId === product.id
            // ))

            let usersResponse = await GetUser.fetchUser();
            let usersResponseBody = await usersResponse.json();
            let user = await usersResponseBody.filter((user) => (
                user.id === userContext.user.currentUserId
            ))
        
            setAllState(prev => ({
                ...prev,
                currentUser : user[0],
            }))

            
            if(userContext.user.currentUserId === user[0].id && user[0].orders && user[0].orders.length>0){

                let numberOfPrevProductOrders = user[0].orders.filter(order => (
                    order.id === product.id
                ))

                if(numberOfPrevProductOrders[0] !== undefined){
                    // console.log("numberOfPrevProductOrders",numberOfPrevProductOrders[0].quantity)
                    setAllState((prev) =>({
                        ...prev,
                        orderQuantity : numberOfPrevProductOrders[0].quantity,
                        // showChangeProduct : true,
                        quantityInStock : product.quantityInStock - numberOfPrevProductOrders[0].quantity
                    })) 

                }
                
            }   

        })()

    }, [userContext.user.changeProduct,allState.orderQuantity]);


    const onAddToCartClick = async (product) => {

        if(userContext.user.currentUserId === null){
            onCheckLogin();
            return
        }
        
        setAllState(prev=>({
            ...prev,
            showChangeProduct : !allState.showChangeProduct,
            
        }))
        
        
        let beforeOrderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{method : "GET"})
        let beforeOrderResponseBody = await beforeOrderResponse.json();
        
        if(beforeOrderResponseBody.orders === undefined){
            createNewOrder(product)
            AddOrder(allState.orderQuantity)
        }else{

            let result = beforeOrderResponseBody.orders.filter(order => (
                order.id === product.id
            ))

            if(result.length !== 0) {
                updateProduct(product)
                AddOrder(allState.orderQuantity)
            }else{
                createNewOrder(product)
                AddOrder(allState.orderQuantity)
            }

        }   

    }

    const createNewOrder = async (product)=>{
        
        let beforeOrderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{method : "GET"})
        let beforeOrderResponseBody = await beforeOrderResponse.json();
        let totalOrders = []

        let newOrders = {
            id : product.id,
            productId: product.id,
            productName : product.productName,
            quantity: 1,
            isPaymentCompleted: false,
            imageProduct: product.image,
        }

        totalOrders.push(newOrders)

        if(beforeOrderResponseBody.orders !== undefined){
            
            beforeOrderResponseBody.orders.forEach(element => {
                totalOrders.push(element)
            })
            
        }
       
        setAllState(prev=>({
            ...prev,
            quantityInStock : allState.quantityInStock -1,
            orderQuantity : allState.orderQuantity + 1
        }))

        // console.log("createNewOrder method",allState.totalOrders)

        let updateOrder ={
            email: allState.currentUser.email,
            password: allState.currentUser.password,
            fullName: allState.currentUser.fullName,
            dateOfBrith: allState.currentUser.dateOfBrith,
            gender: allState.currentUser.gender,
            country: allState.currentUser.country,
            recieveNewsLetters: allState.currentUser.recieveNewsLetters,
            role: allState.currentUser.role,
            imageUser: allState.currentUser.imageUser,
            id: userContext.user.currentUserId,
            orders : totalOrders
        } 

    
        let orderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{
            method : "PUT",
            body : JSON.stringify(updateOrder),
            headers:{"Content-Type":"application/json"}
        })
        
        let orderResponseBody = await orderResponse.json()

    }

    const updateProduct = async (product) => {

        setAllState(prev => ({
            ...prev,
            orderQuantity : allState.orderQuantity + 1,
            quantityInStock: allState.quantityInStock - 1,
        }))

        let getOrderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{method : "GET"})
        let getOrderResponseBody = await getOrderResponse.json()

        let totalBeforeOrders = getOrderResponseBody.orders
        let currentOrder = totalBeforeOrders.filter(order=> order.id === product.id)
            
        currentOrder[0].quantity = allState.orderQuantity + 1

        let totalOrder = []

        totalOrder.push(currentOrder[0])

        let beforeResult = totalBeforeOrders.filter(order=> order.id !== product.id)

        beforeResult.forEach((result) => {
            totalOrder.push(result)
        })        

        let updateOrder ={
            email: getOrderResponseBody.email,
            password: getOrderResponseBody.password,
            fullName: getOrderResponseBody.fullName,
            dateOfBrith: getOrderResponseBody.dateOfBrith,
            gender: getOrderResponseBody.gender,
            country: getOrderResponseBody.country,
            recieveNewsLetters: getOrderResponseBody.recieveNewsLetters,
            role: getOrderResponseBody.role,
            imageUser: getOrderResponseBody.imageUser,
            id: userContext.user.currentUserId,
            orders :totalOrder
        } 

        let orderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{
            method : "PUT",
            body : JSON.stringify(updateOrder),
            headers:{"Content-Type":"application/json"}
        })

        let orderResponseBody = await orderResponse.json();
        // console.log("orderResponseBody",orderResponseBody);
        return orderResponseBody;
    }

    const onDeletedToCartClick = async (product) => {
        
        setAllState(prev => ({
            ...prev,
            orderQuantity : allState.orderQuantity - 1,
            quantityInStock: allState.quantityInStock + 1,
        }))
        // stock(allState.quantityInStock)
        let getOrderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{method : "GET"})
        let getOrderResponseBody = await getOrderResponse.json()


        let totalBeforeOrders = getOrderResponseBody.orders
        let currentOrder = totalBeforeOrders.filter(order=> order.id === product.id)
            
        currentOrder[0].quantity = allState.orderQuantity - 1

        if (currentOrder[0].quantity !== 0) {
            
            let totalOrder = []

            totalOrder.push(currentOrder[0])

            let beforeResult = totalBeforeOrders.filter(order=> order.id !== product.id)

            beforeResult.forEach((result) => {

                totalOrder.push(result)
            }) 
            
            OrderReduction(allState.orderQuantity)

            let updateOrder ={
                email: getOrderResponseBody.email,
                password: getOrderResponseBody.password,
                fullName: getOrderResponseBody.fullName,
                dateOfBrith: getOrderResponseBody.dateOfBrith,
                gender: getOrderResponseBody.gender,
                country: getOrderResponseBody.country,
                recieveNewsLetters: getOrderResponseBody.recieveNewsLetters,
                role: getOrderResponseBody.role,
                imageUser: getOrderResponseBody.imageUser,
                id: userContext.user.currentUserId,
                orders :totalOrder
            } 

            let orderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{
                method : "PUT",
                body : JSON.stringify(updateOrder),
                headers:{"Content-Type":"application/json"}
            })

            let orderResponseBody = await orderResponse.json();
            // console.log("orderResponseBody",orderResponseBody);
            return orderResponseBody;

       }else{

            let getOrderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{method : "GET"})
            let getOrderResponseBody = await getOrderResponse.json()


            let totalBeforeOrders = getOrderResponseBody.orders
            let beforeResult = totalBeforeOrders.filter(order=> order.id !== product.id)

            let totalOrders = []

            beforeResult.forEach((result) => {

                totalOrders.push(result)
            })  
            
            OrderReduction()

            let updateOrder ={
                email: getOrderResponseBody.email,
                password: getOrderResponseBody.password,
                fullName: getOrderResponseBody.fullName,
                dateOfBrith: getOrderResponseBody.dateOfBrith,
                gender: getOrderResponseBody.gender,
                country: getOrderResponseBody.country,
                recieveNewsLetters: getOrderResponseBody.recieveNewsLetters,
                role: getOrderResponseBody.role,
                imageUser: getOrderResponseBody.imageUser,
                id: userContext.user.currentUserId,
                orders :totalOrders
            } 

            let orderResponse = await fetch(`http://localhost:5000/users/${userContext.user.currentUserId}`,{
                method : "PUT",
                body : JSON.stringify(updateOrder),
                headers:{"Content-Type":"application/json"}
            })


            let orderResponseBody = await orderResponse.json();
            // console.log("orderResponseBody",orderResponseBody);
            return orderResponseBody;

       }
        
    }

    return ( 

        <>
            {allState.orderQuantity>0 || hiddenAddToCard  ?( 

                <Box className="flex justify-between items-center">
                                        
                    <img src={require("../../images/decrease.png")} 
                        className="w-8 h-8 cursor-pointer" 
                        alt="icons-decrease" 
                        onClick={()=>onDeletedToCartClick(product)}
                    />
                    
                    {/* <button className="text-green-600 border border-yellow-800 px-3 py-2 mr-2 mb-1 rounded-xl text-sm bg-yellow-100">
                    </button> */}
                    {allState.orderQuantity>0 ?
                        <span className="bg-slate-600 text-slate-100 flex justify-center items-center 
                                        text-xs font-semibold m-2 px-2.5 py-0.5 rounded text-base"
                        >
                            {allState.orderQuantity}
                        </span>
                        :
                        "" 
                    } 

                    {allState.quantityInStock === 0 ?
                            ""
                        :
                        <img src={require("../../images/add.png")} 
                            className="w-8 h-8 cursor-pointer"  
                            alt="icons-add" 
                            onClick={()=>onAddToCartClick(product)}
                        />
                    }

                    {/* <button className="bg-yellow-200 text-rose-600 border-[1px] border-rose-900 shadow-lg shadow-red-500/50 px-3 py-2 mr-2 mb-1 rounded-xl text-sm">           
                        
                    </button> */}
                </Box>


                ):( 
                    <button 
                        className="text-green-200 border-2 border-neutral-600
                        focus:outline-none rounded-lg text-sm text-center 
                        mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100 btn_Buy" 
                        onClick={()=>onAddToCartClick(product)}
                    >
                        <i className="fa fa-cart-plus"></i>Add to card
                    </button>
                )
            }

        </>
     )

}

export default ProductOrderRegistration ;