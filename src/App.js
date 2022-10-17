import './App.css';
import Login from './component/Login';
import Register from './component/Register';
import NoMatchPage from './component/NoMatchPage';
import Dashboard from './component/Dashboard';
import {Route,Routes,BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>

      <div className="container-fluid">

        <Routes>
          <Route path="/" exact element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="*" element={<NoMatchPage/>}/>
        </Routes>

      </div>

    </BrowserRouter>
    // <div className="App">
    //   <Login/>
    //   <Register/>
    //   <NoMatchPage/>
    //   <Dashboard/>
    // </div>
  );
}

export default App;
