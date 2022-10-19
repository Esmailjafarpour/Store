import React , {useState,useEffect} from 'react';

const Register = () => {

    const [state, setState] = useState({
        email:"",
        password:"",
        fullName:"",
        dateOfBrith:"",
        gender:"",
        country:"",
        recieveNewsLetters:""
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

    useEffect(() => {
        document.title = 'Register';
    }, []);

    return(
       <div className="row">
         <div className="col-lg-6 col-md-7 mx-auto">
            <div className="card border-success shadow my-2">
                <div className="card-header border-bottom border-success">
                    <h4 style={{fontSize:'40px'}} className="text-success text-center">Register</h4>
                </div>
                <div className="card-body border-success">
                    {/* Email */}
                    <div className="form-group form-row">
                        <label htmlFor="Email" className="col-lg-4 mb-1">Email</label>
                        <input  
                            type="text"
                            id="Email" 
                            name="email"
                            className="form-control mb-2" 
                            value={state.email}
                            placeholder="example@gmail.com"
                            onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                        />
                    </div>
                    {/* Password */}
                    <div className="form-group form-row">
                        <label htmlFor="Password" className="col-lg-4 mb-1">Password</label>
                        <input  
                            type="password" 
                            id="Password"
                            name="password"
                            className="form-control mb-2" 
                            value={state.password}
                            placeholder="**********"
                            onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                        />
                    </div>
                    {/* FullName */}
                    <div className="form-group form-row">
                        <label htmlFor="FullName" className="col-lg-4 mb-1">FullName</label>
                        <input  
                            type="text" 
                            id="FullName"
                            name="fullName"
                            className="form-control mb-2" 
                            value={state.fullName}
                            placeholder="Esmail"
                            onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                        />
                    </div>
                    {/* DateOfBrith */}
                    <div className="form-group form-row">
                        <label htmlFor="DateOfBrith" className="col-lg-4 mb-1">Date Of Brith</label>
                        <input  
                            type="date" 
                            id="DateOfBrith"
                            name="dateOfBrith"
                            className="form-control mb-2" 
                            value={state.dateOfBrith}
                            placeholder="00-00-00"
                            onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                        />
                    </div>
                    {/* Gender */}
                    <div className="form-group form-row">
                        <label htmlFor="" className="col-lg-4 mb-1">Gender</label>
                        <div className="col-lg-8 d-flex justify-content-around w-100">
                            <div className="form-check">
                                <input  
                                    type="radio" 
                                    id="male"
                                    name="gender"
                                    value="male"
                                    className="form-check-input mb-2" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                    checked={state.gender === "male" ? true : false}
                                />
                                <label htmlFor="male" className="form-check-inline mb-1">Male</label>
                            </div>
                            <div className="form-check">
                                <input  
                                    type="radio" 
                                    id="female"
                                    name="gender"
                                    value="female"
                                    className="form-check-input mb-2" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                                    checked={state.gender === "female" ? true : false}
                                />
                                <label htmlFor="female" className="form-check-inline mb-1">Female</label>
                            </div>
                        </div>
                    </div>

                    {/* country */}
                    <div className="form-group form-row">
                        <label htmlFor="Country" className="col-lg-4 mb-1">Country</label>
                        <div className="col-lg-8">
                            <select 
                                multiple={false}  
                                id="Country"
                                name="country"
                                className="form-control mb-2" 
                                value={state.country}
                                onChange={(e) => setState({...state,[e.target.name]: e.target.value})}
                            >
                                {countries.map((country)=>(
                                    <option key={country.id} value={country.id}>{country.countryName}</option>
                                ))}

                            </select>
                        </div>
                    </div>
                    {/* End Of Country */}

                    {/* Recive News Letters */}
                    <div className="form-group form-row">
                        <label htmlFor="" className="col-lg-4 mb-1">Recieve News Letters</label>
                        <div className="col-lg-8">
                            <div className="form-check">
                                <input  
                                    type="checkbox" 
                                    id="recieveNewsLetters"
                                    name="recieveNewsLetters"
                                    value="true"
                                    className="form-check-input mb-2" 
                                    onChange={(e) => setState({...state,[e.target.name]: e.target.checked})}
                                    checked={state.recieveNewsLetters === true ? true : false}
                                />
                                <label htmlFor="recieveNewsLetters" className="form-check-inline mb-1">RecieveNewsLetters</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
       </div>
    )
}

export default Register;