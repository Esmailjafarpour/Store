import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {BrandsService,CategoriesService}from '../Service.js';
import {NavLink,useNavigate} from 'react-router-dom';

const styleBox = {
  '& .MuiTextField-root': { m: 1, width: '25ch' },
  marginTop:'5px',
  width: 'auto',
  display:"flex",
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  borderColor:'green'
}

const styleTextField = {
    '& .MuiTextField-root': { m: 1, width: '25ch',borderColor : 'red' },
    width:250,
    height: "auto",
    bgcolor: '#201f1f',
    border: '2px solid #404040',
    borderRadius: '8px',
    boxShadow: 24,
    marginTop:'10px',
    label : {color: 'white',fontSize :14,marginButton:2},
    input: { color: 'white',fontSize :14},
    div: { color: 'white',fontSize :14 }
}

function BasicTextFields() {

  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [Currency, setCurrency] = React.useState([]);
  const [state, setState] = React.useState({
    productName:"",
    Price:"",
    brand:"",
    category:"",
    Rating:"",
    quantityInStock:"",
    image:""
});

  React.useEffect(() => {
    (async () => {
        let brandResponse = await BrandsService.fetchBrands();
        let brandResponseBody = await brandResponse.json();
        brandResponseBody.forEach((brand) => {
            brand.isChecked = true;
        }); 
        setBrands(brandResponseBody);
        let categoriesResponse = await CategoriesService.fetchCategories();
        let categoriesResponseBody = await categoriesResponse.json();
        categoriesResponseBody.forEach((category) => {
            category.isChecked = true;
        });
        setCategories(categoriesResponseBody);

      })();
  },[state])

  const addNewProduct = async () => {

    state.map((item) => {
      if(!item && item.length === 0){
        console.log(item)
          return
      }
  })

    let response = await fetch("http://localhost:5000/products", {
                method : "POST",
                body : JSON.stringify({
                  productName : state.productName,
                  Price : state.Price,
                  brand : state.brand,
                  category : state.category,
                  Rating : state.Rating,
                  quantityInStock : state.quantityInStock,
                  image : state.image,
                    
                }),
                headers : {
                    "Content-type": "application/json",
                },
            });
          }
  
  
    return (
        <Box
            component="form"
            sx={styleBox}
            noValidate
            autoComplete="off"
        >
              <TextField 
                id="outlined-basic" 
                name="productName"
                type="text"
                label="productName" 
                variant="outlined"
                value={state.productName} 
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                sx={styleTextField} 
              />

              <TextField
                id="outlined-number"
                // select
                name="Price"
                label="Price"
                type="number"
                value={state.Price}
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.Price}
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                sx={styleTextField}
              />
            
              <TextField
                id="outlined-select-currency"
                select
                name="brand"
                label="brand"
                value={state.brand}
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                sx={styleTextField}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.brandName} value={brand.brandName}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </TextField>
            
              <TextField
                id="outlined-select-currency"
                select
                label="category"
                name="category"
                // value={currency}
                // onChange={handleChange}
                // helperText="Please select your currency"
                sx={styleTextField}
                value={state.category}
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
              >
                {categories.map((category) => (
                  <MenuItem key={category.categoryName} value={category.categoryName}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                id="outlined-number"
                name="Rating"
                label="Rating"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.Rating}
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                sx={styleTextField}
              />
          
              <TextField
                id="outlined-number"
                name="quantityInStock"
                label="quantityInStock"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.quantityInStock}
                onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                sx={styleTextField}
              />
         
              <Button
                  variant="contained"
                  component="label"
                  sx={{backgroundColor: "green"}}
                >
                  Upload File
                  <input
                    type="file"
                    name="image"
                    onChange={(e)=> setState({...state,[e.target.name]:e.target.value})}
                    hidden
                />
              </Button>

              <div className="mt-5 flex justify-center">
                <button type="button" className="focus:outline-none text-white bg-green-900 hover:bg-green-800 
                      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 
                      dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      onClick={()=> addNewProduct() }
                      >
                        Create New Product
                    {/* <NavLink className="nav-link" activeclassname="active" aria-current="page" to="#!">
                          
                    </NavLink> */}
                </button>
            </div>    
          </Box>
  );
}

export default BasicTextFields;