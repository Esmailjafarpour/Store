import React ,{useState,useEffect,useContext} from 'react';
import { useNavigate } from "react-router-dom";
import {UserContext} from '../UserContext';

const Login = (props) => {

    const userContext = useContext(UserContext);

    const [email, setEmail] = useState('scott@test.com');
    const [password, setPassword] = useState('Scott123');

    const [dirty, setDirty] = useState({
        email:false,
        password :false,
    });

    const [errors, setErrors] = useState({
        email:[],
        password :[],
    });

    const [loginMessage, setLoginMessage] = useState("");
    const navigate = useNavigate()
    


    useEffect(() => {
        document.title = 'Login'
    }, []);

    const validate = () => {

        let errorsData = {};

        //email
        errorsData.email = [];

        // email can`t blank
        if (!email) {
            errorsData.email.push("Email can`t be blank")
        }

        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (email) {
            if (!validEmailRegex.test(email)) {
                errorsData.email.push("Proper email address is expected")
            }
        }

        //password
        errorsData.password = [];

        // password can`t blank
        if (!password) {
            errorsData.password.push("Password can`t be blank")
        }

        const validPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/gm;
        if (password) {
            if (!validPasswordRegex.test(password)) {
                errorsData.password.push("Password should be 6 to 15 charecters long with at least one uppercase letter,one lowercase letter and on digit")
            }
        }

        setErrors(errorsData)
    }

    useEffect(validate, [email,password]);

    const onLoginClick = async() => {

        let dirtyData = dirty;
        Object.keys(dirty).forEach(control => {
            dirtyData[control] = true
        });

        setDirty(dirtyData);
        validate();

        if (isValid()) {
            let response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`,{method:"GET"});
            if (response.ok) {
                let responseBody = await response.json();
                if (responseBody.length>0) {
                    userContext.setUser({
                        ...userContext.user,
                        isLoggedIn:true,
                        currentUserId : responseBody[0].id,
                        currentUserName : responseBody[0].fullName,
                    })
                    navigate("/dashboard")
                    // userContext.dispatch({
                    //     type : "login",
                    //     payload : {
                    //         currentUserId : responseBody[0].id,
                    //         currentUserName : responseBody[0].fullName,
                    //         currentUserRole: responseBody[0].role,
                    //     }
                    // })

                    if (responseBody[0].role === "user") {
                        // props.history.replace("/dashboard")
                    } else {
                        // props.history.replace("/products")
                    }

                }else{
                    setLoginMessage(<span className="text-danger">Invalid Login,please try again</span>)
                }

            }else{
                setLoginMessage(<span className="text-danger">Unable to connect to server</span>)
            }
        }
    }

    const isValid = () => {
        let valid = true;
        for (const control in errors) {
           if (errors[control].length>0) valid = false;
        }
        return valid
    }
       
    
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
                                onBlur={() => {
                                    setDirty({...dirty, email:true});
                                    validate();
                                }}
                            />
                            <div className="text-danger">
                                {dirty["email"]&&errors['email'][0] ? errors['email'] : ""}
                            </div>
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
                                onBlur={() => {
                                    setDirty({...dirty, password:true});
                                    validate();
                                }}
                            />
                             <div className="text-danger">
                                {dirty["password"]&&errors['password'][0] ? errors['password'] : ""}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        <div className="m-1">{loginMessage}</div>
                        <button className="btn btn-success m-2"onClick={onLoginClick}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;