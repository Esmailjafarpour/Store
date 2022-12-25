import './App.css';
import React,{useState,useReducer} from 'react';
import Login from './component/Atentication/Login/Login';
import Register from './component/Atentication/Register/Register';
import NoMatchPage from './component/NoMatchPage/NoMatchPage';
import Dashboard from './component/Dashboard/Dashboard';
import Navbar from './component/Navbar/Navbar.jsx';
import Footer from './component/Footer/Footer.jsx';
import Store from './component/Store/Store.jsx';
import Productlist from './component/Productlist/Productlist.jsx';
import NewProduct from './component/NewProduct/NewProduct.jsx';
import {UserContext} from './UserContext';
import {Route,Routes,BrowserRouter} from 'react-router-dom';


let initialUser = {
  isLoggedIn:false,
  currentUserId:null,
  currentUserName:null,
  currentUserRole:null,
  orderNumber:null,
  imageUser:null
}

let reducer = (state,action)=>{
 switch (action.type) {
    case "login":
      return {
        isLoggedIn:true,
        currentUserId:action.payload.currentUserId,
        currentUserName:action.payload.currentUserName,
        currentUserRole:action.payload.currentUserRole,
        orderNumber:action.payload.orderNumber,
        imageUser:action.payload.imageUser,
      }

    case "logout":
      return {
        isLoggedIn:false,
        currentUserId:null,
        currentUserName:null,
        currentUserRole:null,
        orderNumber:null,
        imageUser : null,
      }

    case "register":
      return {
        isLoggedIn:true,
        currentUserId:action.payload.currentUserId,
        currentUserName:action.payload.currentUserName,
        currentUserRole:action.payload.currentUserRole,
        orderNumber:0,
        imageUser : action.payload.imageUser,
      }
  default:
    return state
 }
 
}

let initialBrand = {
  brands : null
}

let reducerBrands = (state,action) => {
  switch (action.type) {
    case "brands":
      return{
        brands : action.payload.brands
      }
  
    default:
      return state
  }
}

function App() {

  const [user,dispatch] = useReducer(reducer,initialUser);
  const [brands,dispatchBrands] = useReducer(reducerBrands,initialBrand);

  return (

    <UserContext.Provider value={{user,dispatch,brands,dispatchBrands}}>
      <BrowserRouter>
          <div className="container-fluid p-1 relative">
            <Navbar/>
            <Routes>
              <Route path="/" element={<Store/>}/>
              <Route path="/login" exact={`${true}`} element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/products" element={<Productlist/>}/>
              <Route path="/newProduct" element={<NewProduct/>}/>
              <Route path="*" element={<NoMatchPage/>}/>
            </Routes>
            <Footer/>
          </div>
        </BrowserRouter>
    </UserContext.Provider>
  );
  
}

export default App;
