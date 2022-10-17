import './App.css';
import Login from './component/Login';
import Register from './component/Register';
import NoMatchPage from './component/NoMatchPage';
import Dashboard from './component/Dashboard';
import {Route,Switch,BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>

      <div className="container-fluid">

        <Switch>

          <Route path="/" exact>
            <Login/>
          </Route>

          <Route path="/register">
            <Register/>
          </Route>

          <Route path="/dashboard">
            <Dashboard/>
          </Route>

          <Route path="*">
            <NoMatchPage/>
          </Route>

        </Switch>

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
