import './App.css';
import React,{useState,useReducer} from 'react';
import Login from './component/Login';
import Register from './component/Register';
import NoMatchPage from './component/NoMatchPage';
import Dashboard from './component/Dashboard';
import Navbar from './component/Navbar.jsx';
import Store from './component/Store.jsx';
import Productlist from './component/Productlist.jsx';
import {UserContext} from './UserContext';
import {Route,Routes,BrowserRouter} from 'react-router-dom';
// import { Provider } from 'react-redux';

let initialUser = {
  isLoggedIn:false,
  currentUserId:null,
  currentUserName:null,
  currentUserRole:null,
}

let reducer = (state,action)=>{
 switch (action.type) {
    case "login":
      return {
        isLoggedIn:true,
        currentUserId:action.payload.currentUserId,
        currentUserName:action.payload.currentUserName,
        currentUserRole:action.payload.currentUserRole,
      }

    case "logout":
      return {
        isLoggedIn:false,
        currentUserId:null,
        currentUserName:null,
        currentUserRole:null,
      }

    case "register":
      return {
        isLoggedIn:true,
        currentUserId:action.payload.currentUserId,
        currentUserName:action.payload.currentUserName,
        currentUserRole:action.payload.currentUserRole,
      }
  default:
    return state
 }
 
}

function App() {

  const [user,dispatch] = useReducer(reducer,initialUser);

  return (

    <UserContext.Provider value={{user,dispatch}}>

      <BrowserRouter>

          <Navbar/>

          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Store/>}/>
              <Route path="/login" exact={`${true}`} element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/products" element={<Productlist/>}/>
              <Route path="*" element={<NoMatchPage/>}/>
            </Routes>
          </div>

        </BrowserRouter>

    </UserContext.Provider>

  );
  
}

export default App;
