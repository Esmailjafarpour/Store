import React ,{useState,useEffect,useContext,useRef} from 'react';
import { useNavigate } from "react-router-dom";
import {UserContext} from '../../../UserContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "./style.css";

const Login = (props) => {

    const userContext = useContext(UserContext);
    const [allState, setAllState] = useState({
        email : 'esmailjafarpour29@gmail.com',
        password : '123ASDzxc',
        showBtnRegister : 'hidden', 
        dirty : {
            email:false,
            password :false,
        },
        errors : {
            email:[],
            password :[],
        },
        loginMessage : ""

    });
    
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
        if (!allState.email) {
            errorsData.email.push("Email can`t be blank")
        }

        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (allState.email) {
            if (!validEmailRegex.test(allState.email)) {
                errorsData.email.push("Proper email address is expected")
            }
        }

        //password
        errorsData.password = [];

        // password can`t blank
        if (!allState.password) {
            errorsData.password.push("Password can`t be blank")
        }

        const validPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/gm;
        if (allState.password) {
            if (!validPasswordRegex.test(allState.password)) {
                errorsData.password.push("Password should be 6 to 15 charecters long with at least one uppercase letter,one lowercase letter and on digit")
            }
        }

        setAllState(prev => ({
            ...prev,
            errors : errorsData
        }))

        // setErrors(errorsData)
    }

    useEffect(validate, [allState.email,allState.password]);

    const onLoginClick = async() => {

        let dirtyData = allState.dirty;
        Object.keys(allState.dirty).forEach(control => {
            dirtyData[control] = true
        });

        setAllState(prev => ({
            ...prev,
            dirty : dirtyData
        }))
        // setDirty(dirtyData);
        validate();

        if (isValid()) {
            let response = await fetch(`http://localhost:5000/users?email=${allState.email}&password=${allState.password}`,{method:"GET"});
            if (response.ok) {
                let responseBody = await response.json();
                if (responseBody.length>0) {
                    console.log(responseBody[0])
                    userContext.dispatch({
                        type:"login",
                        payload:{
                            currentUserId : responseBody[0].id,
                            currentUserName : responseBody[0].fullName,
                            currentUserRole : responseBody[0].role,
                            imageUser: responseBody[0].imageUser,
                            orderNumber:0,
                        },
                    })
                    navigate("/")

                    if (responseBody[0].role === "user") {
                        navigate("/dashboard")
                    } else {
                        navigate("/products")
                    }

                }else{
                    setAllState(prev => ({
                        ...prev,
                        loginMessage : <span className="text-danger">Invalid Login,please try again</span>,
                        showBtnRegister : "black",
                    }))
                    // setLoginMessage(<span className="text-danger">Invalid Login,please try again</span>)
                }
                
            }else{
                // setLoginMessage(<span className="text-danger">Username or password is not correct or you have not registered before</span>)
                setAllState(prev => ({
                    ...prev,
                    showBtnRegister : "black",
                    loginMessage : <span className="text-danger">Username or password is not correct or you have not registered before</span>
                }))
                // setShowBtnRegister("black")
            }
        }
    }

    const onRegisterClick = () => {
        navigate("/register")
    }

    const isValid = () => {
        let valid = true;
        for (const control in allState.errors) {
           if (allState.errors[control].length>0) valid = false;
        }
        return valid
    }
       
    return(
        <Box className="row row-login">
            <Box className="col-md-6 border-2 border-stone-800 mx-auto rounded-3 mt-5 p-3 bg-zinc-900">
                <Box className="shadow-lg my-2 rounded-3 overflow-hidden p-2 bg-zinc-800 border-2 border-stone-900">
                    <Box className="card-header bg-dark">
                        <Typography style={{fontSize:'40px'}}className="title-login text-center">
                            Login
                        </Typography>
                    </Box>
                    <Box className="border-2 border-stone-700 p-2 rounded mx-2 my-2">
                        <Box className="form-group form-group-email">
                            <label htmlFor="email"className="mb-3 text-light">Email</label>
                            <input 
                                 autoComplete="new-password"
                                    type="text" 
                                    className="form-control input-login" 
                                    id="email"
                                    placeholder="Enter Your Email" 
                                    name="email"
                                    value={allState.email}
                                    ref={myEmailRef}
                                    onChange={(e) => 
                                        setAllState(prev => ({
                                            ...prev,
                                            email : e.target.value
                                        }))
                                        // setEmail(e.target.value)
                                    }
                                    onBlur={() => {
                                        setAllState(prev => ({
                                            ...prev,
                                            dirty:{...allState.dirty,email : true}
                                        }))
                                        // setDirty({...dirty, email:true});
                                        validate();
                                }}
                            />
                            <Box className="text-danger">
                                {allState.dirty["email"]&&allState.errors['email'][0] ? allState.errors['email'] : ""}
                            </Box>
                        </Box>
                        <Box className="form-group form-group-password mt-3" >
                            <label htmlFor="password"className="mb-3 text-light">Password</label>
                            <input 
                                    autoComplete="new-password"
                                    type="password" 
                                    className="form-control input-login" 
                                    id="password"
                                    placeholder="Enter Your password" name="password"
                                    value={allState.password}
                                    onChange={(e) => 
                                        setAllState(prev => ({
                                            ...prev,
                                            password : e.target.value
                                        }))
                                        // setPassword(e.target.value)
                                    }
                                    onBlur={() => {
                                        setAllState(prev => ({
                                            ...prev,
                                            dirty:{...allState.dirty,password : true}
                                        }))
                                        // setDirty({...dirty, password:true});
                                        validate();
                                }}
                            />
                             <Box className="text-danger">
                                {allState.dirty["password"]&&allState.errors['password'][0] ? allState.errors['password'] : ""}
                            </Box>
                        </Box>
                    </Box>
                    <Box className="card-footer text-center mt-3">
                        <Box className="m-1 w-60 mx-auto">{allState.loginMessage}</Box>
                        <Box className="flex justify-center">
                            <button className="w-40 text-amber-600 border-2 border-stone-500
                                focus:outline-none rounded-lg text-sm px-3 py-2 text-center 
                                mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100"
                                onClick={onLoginClick}>
                                Login
                            </button>
                            <button className={`${allState.showBtnRegister} w-40 text-teal-600 border-2 border-stone-500
                                    focus:outline-none rounded-lg text-sm px-3 py-2 text-center 
                                    mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100`}
                                    onClick={onRegisterClick}>
                                Register
                            </button>
                        </Box>    
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}


export default Login;




// const [email, setEmail] = useState('naderjafarpour@gmail.com');
    // const [password, setPassword] = useState('ASDzxc12');
    // const [showBtnRegister, setShowBtnRegister] = useState('hidden');

    // const [dirty, setDirty] = useState({
    //     email:false,
    //     password :false,
    // });
    
    // const [errors, setErrors] = useState({
    //     email:[],
    //     password :[],
    // });
    
    // const [loginMessage, setLoginMessage] = useState("");