import './App.css';
import React,{useState} from 'react';
import Login from './component/Login';
import Register from './component/Register';
import NoMatchPage from './component/NoMatchPage';
import Dashboard from './component/Dashboard';
import Navbar from './component/Navbar.jsx';
import Store from './component/Store.jsx';
import {UserContext} from './UserContext';
import {Route,Routes,BrowserRouter} from 'react-router-dom';
// import { Provider } from 'react-redux';


function App() {

  const [user, setUser] = useState({
    isLoggedIn:false,
    currentUserId:null,
    currentUserName:null
  })

  return (

    <UserContext.Provider value={{user,setUser}}>

      <BrowserRouter>

          <Navbar/>

          <div className="container-fluid">
            <Routes>
              <Route path="/" exact={`${true}`} element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/store" element={<Store/>}/>
              <Route path="*" element={<NoMatchPage/>}/>
            </Routes>
          </div>

        </BrowserRouter>

    </UserContext.Provider>

  );
  
}

export default App;
