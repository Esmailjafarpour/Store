import React , {useState,useEffect,useContext,useRef} from 'react';
import { useNavigate } from "react-router-dom";
import {UserContext} from '../../../UserContext';
import Button from '@mui/material/Button';
import "./register.css";
// import CloseIcon from '@mui/icons-material/Close';

const Register = (props) => {

    const [state, setState] = useState({
        email:"",
        password:"",
        fullName:"",
        dateOfBrith:"",
        gender:"",
        country:"",
        recieveNewsLetters:"",
        imageUser:""
    });

    const [countries, setCountries] = useState([
        {id:1,countryName:"Iran"},
        {id:2,countryName:"India"},
        {id:3,countryName:"USA"},
        {id:4,countryName:"UK"},
        {id:5,countryName:"japan"},
        {id:6,countryName:"France"},
        {id:7,countryName:"Brazil"},
        {id:8,countryName:"Canada"} 
    ]);

    const [errors, setErrors] = useState({
        email:[],
        password:[],
        fullName:[],
        dateOfBrith:[],
        gender:[],
        country:[],
        recieveNewsLetters:[],
        imageUser:[]
    });

    const [dirty, setDirty] = useState({
        email:false,
        password:false,
        fullName:false,
        dateOfBrith:false,
        gender:false,
        country:false,
        recieveNewsLetters:false,
        imageUser:false
    });

    const [message, setMessage] = useState();
    
    const userContext = useContext(UserContext);

    const myEmailRef = useRef();

    const navigate = useNavigate()

    const validate = () => {

        let errorsData = {};

        // email
        errorsData.email = [];

        // email can`t blank
        if (!state.email) {
            errorsData.email.push("Email can`t blank")
        }

        // email regex
        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (state.email) {
            if (!validEmailRegex.test(state.email)) {
                errorsData.email.push("Proper email address is expected")
            }
        }

        // password
        errorsData.password = [];

        // password can`t blank
        if (!state.password) {
             errorsData.password.push("Password can`t blank")
        }
 
        // password regex
        const validPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,10}$/gm;
        if (state.password) {
            if (!validPasswordRegex.test(state.password)) {
                 errorsData.password.push("Password should be 6 to 15 charecters long with at least one uppercase letter,one lowercase letter and on digit")
            }
        }

        // fullName
        errorsData.fullName = [];

        // fullName can`t blank
        if (!state.fullName) {
            errorsData.fullName.push("Full Name can`t blank")
        }

        // DateOfBrith
        errorsData.dateOfBrith = [];

        //  can`t DateOfBrith blank
        if (!state.dateOfBrith) {
            errorsData.dateOfBrith.push("Date Of Brith can`t blank")
        }

        // Gender
        errorsData.gender = [];

        //  can`t Gender blank
        if (!state.gender) {
            errorsData.gender.push("Please select Gender either male for female")
        }

        // Country
        errorsData.country = [];

        //  can`t Country blank
        if (!state.country) {
             errorsData.country.push("Please select a Country")
        }


        // image
        errorsData.imageUser = [];

        if(!state.imageUser){
            errorsData.imageUser.push("There is no photo")
        }

        setErrors(errorsData)

    }

    useEffect(validate,[state]);
     
    useEffect(() => {
        document.title = 'Register';
        myEmailRef.current.focus();
    }, []);

    let isValid = () => {
        let valid = true
        for (let control in errors) {
            if (errors[control].length > 0) {
                valid = false
            }
        }

        return valid
    }

    const onRegisterClick = async () => {
        let dirtyData = dirty;
        Object.keys(dirty).forEach(control => {
            dirtyData[control] = true
        });
        setDirty(dirtyData);
        validate();

        if(isValid()){
            let response = await fetch("http://localhost:5000/users", {
                method : "POST",
                body : JSON.stringify({
                    email : state.email,
                    password : state.password,
                    fullName : state.fullName,
                    dateOfBrith : state.dateOfBrith,
                    gender : state.gender,
                    country : state.country,
                    recieveNewsLetters : state.recieveNewsLetters,
                    role : "user",
                    imageUser : state.imageUser
                }),
                headers : {
                    "Content-type": "application/json",
                },
            });

            if (response.ok){
                const responseBody = await response.json()
                console.log("responseBody",responseBody)
                userContext.dispatch({
                    type : "register",
                    payload:{
                        currentUserId : responseBody.id,
                        currentUserName : responseBody.fullName,
                        currentUserRole : responseBody.role,
                        imageUser : responseBody.imageUser
                    }
                })
                setMessage(<span className="text-success">SuccessFully Registered</span>);
                navigate("/dashboard");

            }else{

                setMessage(<span className="text-danger">Errors in database connection</span>)

            }

        }else {
            setMessage(<span className="text-danger">Errors</span>)
        }
    }

    return(
       <div className="row row-register mx-auto">

         <div className="col-md-6 border-2 border-stone-800  rounded-3 mt-5 p-3 bg-zinc-900">
            <div className="shadow-lg my-2 rounded-3 overflow-hidden p-3 bg-zinc-800 border-2 border-stone-900">
                <div className="card-header">
                    <h4 style={{fontSize:'40px'}} className="title-register text-center">Register</h4>
                    <ul className="text-warning text-center p-0">
                        {Object.keys(errors).map((control)=>{
                            if(dirty[control]) {
                                return errors[control].map((err)=>{
                                    return <li key={err}>{err}</li>
                                })
                            }else{
                                return "";
                            }
                        })}
                    </ul>
                </div>
                <div className=" p-3 bg-zinc-900 border-2 border-stone-700 rounded-3">
                    {/* Email */}
                    <div className="row mb-3">
                        <label htmlFor="Email" className="col-lg-2 text-light py-1">Email</label>
                        <div className="col-lg-10">
                             <input  
                                type="text"
                                id="Email" 
                                name="email"
                                className="form-control input-register" 
                                value={state.email}
                                placeholder="example@gmail.com"
                                ref={myEmailRef}
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                onBlur={(e) => {
                                    setDirty({...dirty , [e.target.name] : true});
                                    validate();
                                }}
                            />
                            <div className="text-warning">
                                {dirty["email"]&&errors['email'][0] ? errors['email'] : ""}
                            </div>
                        </div>
                       
                    </div>
                    {/* Password */}
                    <div className="row mb-3">
                        <label htmlFor="Password" className="col-lg-2 text-light py-1">Password</label>
                        <div className="col-lg-10">
                            <input  
                                type="password" 
                                id="Password"
                                name="password"
                                className="form-control mb-2 input-register" 
                                value={state.password}
                                placeholder="**********"
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                onBlur={(e) => {
                                    setDirty({...dirty , [e.target.name] : true});
                                    validate();
                                }}
                            />
                            <div className="text-warning">
                                {dirty["password"]&&errors['password'][0] ? errors['password'] : ""}
                            </div>
                        </div>    
                    </div>
                    {/* FullName */}
                    <div className="row mb-3">
                        <label htmlFor="FullName" className="col-lg-2 text-light py-1">FullName</label>
                        <div className="col-lg-10">
                            <input  
                                type="text" 
                                id="FullName"
                                name="fullName"
                                className="form-control mb-2 input-register" 
                                value={state.fullName}
                                placeholder="Esmail"
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                onBlur={(e) => {
                                    setDirty({...dirty , [e.target.name] : true});
                                    validate();
                                }}
                            />
                            <div className="text-warning">
                                {dirty["fullName"]&&errors['fullName'][0] ? errors['fullName'] : ""}
                            </div>
                        </div> 
                    </div>
                    {/* DateOfBrith */}
                    <div className="row mb-3">
                        <label htmlFor="DateOfBrith" className="col-lg-3 text-light py-1">Date Of Brith</label>
                        <div className="col-lg-9">
                            <input  
                                type="date" 
                                id="DateOfBrith"
                                name="dateOfBrith"
                                className="form-control mb-2 input-register" 
                                value={state.dateOfBrith}
                                placeholder="00-00-00"
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                onBlur={(e) => {
                                    setDirty({...dirty , [e.target.name] : true});
                                    validate();
                                }}
                            />
                            <div className="text-warning">
                                {dirty["dateOfBrith"]&&errors['dateOfBrith'][0] ? errors['dateOfBrith'] : ""}
                            </div>
                        </div>    
                    </div>
                    {/* Gender */}
                    <div className="row mb-3">
                        <label htmlFor="" className="col-lg-2 text-light py-1">Gender</label>
                        <div className="col-lg-8 d-flex justify-content-around ">
                            <div className="form-check">
                                <input  
                                    type="radio" 
                                    id="male"
                                    name="gender"
                                    value="male"
                                    className="form-check-input mb-2 input-register" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                    checked={state.gender === "male" ? true : false}
                                />
                                <label htmlFor="male" className="form-check-inline mb-1 text-light">Male</label>
                            </div>
                            <div className="form-check">
                                <input  
                                    type="radio" 
                                    id="female"
                                    name="gender"
                                    value="female"
                                    className="form-check-input mb-2 input-register" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                    checked={state.gender === "female" ? true : false}
                                />
                                <label htmlFor="female" className="form-check-inline mb-1 text-light">Female</label>
                            </div>
                        </div>
                        <div className="text-warning">
                            {dirty["gender"]&&errors['gender'][0] ? errors['gender'] : ""}
                        </div>
                    </div>

                    {/* country */}
                    <div className="row mb-3">
                        <label htmlFor="Country" className="col-lg-2 text-light py-1">Country</label>
                        <div className="col-lg-10">
                            <select 
                                multiple={false}  
                                id="Country"
                                name="country"
                                className="form-control selected" 
                                value={state.country}
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                onBlur={(e) => {
                                    setDirty({...dirty , [e.target.name] : true});
                                    validate();
                                }}
                            >
                                <option value="">Please Select a country</option>
                                {countries.map((country)=>(
                                    <option key={country.id} value={country.id}>{country.countryName}</option>
                                ))}

                            </select>
                        </div>
                        <div className="text-warning">
                            {dirty["country"]&&errors['country'][0] ? errors['country'] : ""}
                        </div>
                    </div>
                    {/* End Of Country */}

                    {/* Recive News Letters */}
                    <div className="row mb-3 text-center">
                        <label htmlFor="" className="col-lg-4 text-light py-1">Recieve News Letters</label>
                        <div className="col-lg-8 d-flex">
                            <div className="form-check  mx-auto">
                                <input  
                                    type="checkbox" 
                                    id="recieveNewsLetters"
                                    name="recieveNewsLetters"
                                    value="true"
                                    className="form-check-input mb-2" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.checked})}
                                    checked={state.recieveNewsLetters === true ? true : false}
                                />
                                <label htmlFor="recieveNewsLetters" className="form-check-inline mb-1 text-light">RecieveNewsLetters</label>
                            </div>
                        </div>
                        
                    </div>

                    <div className="row mb-3">
                        <Button
                            variant="contained"
                            component="label"
                            sx={{backgroundColor: "green"}}
                            // onClick={()=>errors.image && errors.image.length ===0 ? isValid():""}
                            >
                            Upload File
                            <input
                                type="file"
                                name="imageUser"
                                onChange={(e)=> (setState({...state,[e.target.name]:e.target.value.slice(12, e.target.value.length)})
                                )}
                                hidden
                            />
                        </Button>

                         <div className="text-warning">
                            {dirty["imageUser"]&&errors['imageUser'][0] ? errors['imageUser'] : ""}
                        </div>

                     </div> 

                </div>

                {/* footer */}
                <div className="card-footer text-center text-warning mt-3">
                    <div className="m-1 text-warning">{message}</div>
                    <button 
                        className="w-50 text-teal-600 border-2 border-stone-600
                        focus:outline-none rounded-lg text-sm px-3 py-2 text-center 
                        mr-2 mb-1 dark:hover:text-green-600 dark:hover:bg-green-100"
                        onClick={onRegisterClick}
                    >
                        Register
                    </button>
                </div>
                {/* end of footer */}
            </div>
         </div>
       </div>
    )
}

export default Register;