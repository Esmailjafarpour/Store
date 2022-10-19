import React ,{useState,useEffect} from 'react';

const Login = () => {

    useEffect(() => {
        document.title = 'Login'
    }, []);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log(email,password)
   
    return(
        <div className="row">
            <div className="col-lg-5 col-md-7 mx-auto">
                <div className="card border-success shadow-lg my-2">
                    <div className="card-header border-bottom border-success">
                        <h4 style={{fontSize:'40px'}}className="text-success text-center">
                            Login
                        </h4>
                    </div>
                    <div className="card-body border-success border-bottom">
                        <div className="form-group">
                            <label htmlFor="email"className="mb-3">Email</label>
                            <input 
                                autocomplete="off"
                                type="text" 
                                className="form-control" 
                                id="email"
                                placeholder="Enter Your Email" name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3" >
                            <label htmlFor="password"className="mb-3">password</label>
                            <input 
                                autocomplete="off"
                                type="password" 
                                className="form-control" 
                                id="password"
                                placeholder="Enter Your password" name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;