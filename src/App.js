import './App.css';
import Login from './component/Login';
import Register from './component/Register';
import NoMatchPage from './component/NoMatchPage';
import Dashboard from './component/Dashboard';
import Navbar from './component/Navbar.jsx';
import {Route,Routes,BrowserRouter} from 'react-router-dom';

function App() {

  return (

    <BrowserRouter>

        <Navbar/>

        <div className="container-fluid">
          <Routes>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="*" element={<NoMatchPage/>}/>
          </Routes>
        </div>

      </BrowserRouter>
   
  );
  
}

export default App;
