import React ,{useState,useEffect,useContext,useRef} from 'react';
import { useNavigate } from "react-router-dom";
import {UserContext} from '../UserContext';

const Login = (props) => {

    const userContext = useContext(UserContext);

    const [email, setEmail] = useState('naderjafarpour@gmail.com');
    const [password, setPassword] = useState('AS2300592045gf');

    const [dirty, setDirty] = useState({
        email:false,
        password :false,
    });
    
    const [errors, setErrors] = useState({
        email:[],
        password :[],
    });
    
    const [loginMessage, setLoginMessage] = useState("");
    
    const myEmailRef = useRef()
    const navigate = useNavigate()


    useEffect(() => {
        document.title = 'Login';
        myEmailRef.current.focus()
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
                    userContext.dispatch({
                        type:"login",
                        payload:{
                            currentUserId : responseBody[0].id,
                            currentUserName : responseBody[0].fullName,
                            currentUserRole : responseBody[0].role,
                            imageUser: responseBody[0].image,
                            orderNumber:0,
                        },
                    })
                    navigate("/")

                    if (responseBody[0].role === "user") {
                        navigate("/")
                    } else {
                        navigate("/products")
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
            <div className="col-md-4 border-2 border-stone-800 mx-auto rounded-3 mt-5 p-3 bg-zinc-900">
                <div className="shadow-lg my-2 rounded-3 overflow-hidden p-2 bg-zinc-800 border-2 border-stone-900">
                    <div className="card-header bg-dark">
                        <h4 style={{fontSize:'40px'}}className="title-login text-center">
                            Login
                        </h4>
                    </div>
                    <div className="border-2 border-stone-700 p-2 rounded mx-2 my-2">
                        <div className="form-group">
                            <label htmlFor="email"className="mb-3 text-light">Email</label>
                            <input 
                                 autoComplete="new-password"
                                    type="text" 
                                    className="form-control input-login" 
                                    id="email"
                                    placeholder="Enter Your Email" 
                                    name="email"
                                    value={email}
                                    ref={myEmailRef}
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
                            <label htmlFor="password"className="mb-3 text-light">password</label>
                            <input 
                                    autoComplete="new-password"
                                    type="password" 
                                    className="form-control input-login" 
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
                        <button className="w-50 text-teal-600 border-2 border-stone-500
                                focus:outline-none rounded-lg text-sm px-3 py-2 text-center 
                                mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100"
                                onClick={onLoginClick}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;