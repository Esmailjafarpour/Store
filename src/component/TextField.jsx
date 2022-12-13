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

function BasicTextFields({hiddenNewProduct}) {

  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [Currency, setCurrency] = React.useState([]);
  const [newProduct, setNewProduct] = React.useState({
    productName:"",
    price:0,
    brandId:0,
    categoryId:0,
    rating:0,
    quantityInStock:0,
    image:""
});

const [errors, setErrors] = React.useState({
    productName:[],
    price:[],
    brandId:[],
    categoryId:[],
    rating:[],
    quantityInStock:[],
    image:[]
});

const [dirty, setDirty] = React.useState({
  email:false,
  password:false,
  fullName:false,
  dateOfBrith:false,
  gender:false,
  country:false,
  recieveNewsLetters:false
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
  },[newProduct])

  const isValid = () => {
    let valid = true
    let newData = newProduct;
    Object.keys(newProduct).forEach((item) =>{
        if(newData[item].length === 0) {
          switch (item) {
            case "productName":
              setErrors({...errors, item : "There is no product name"})
            case "Price":
              setErrors({...errors, item : "The price for the product has not been specified"})
            case "brand":
              setErrors({...errors, item : "A brand has not been specified for the product"})
            case "category":
              setErrors({...errors, item : "Category is not specified for the product"})
            case "Rating":
              setErrors({...errors, item : "Product rating is not specified"})
            case "quantityInStock":
              setErrors({...errors, item : "The product number is not specified"})
            case "image":
              setErrors({...errors, item : "There is no photo"})
            default:
              break;
          }
          valid = false
        }
      }
    ) 
    return valid
  }

  const addNewProduct = async () => {
    console.log("errors",errors)
    if(isValid()){
        let response = await fetch("http://localhost:5000/products", {
          method : "POST",
          body : JSON.stringify({
            productName : newProduct.productName,
            price : newProduct.price,
            brandId : newProduct.brandId,
            categoryId : newProduct.categoryId,
            rating : newProduct.rating,
            quantityInStock : newProduct.quantityInStock,
            image : newProduct.image,
              
          }),
          headers : {
              "Content-type": "application/json",
          },
        });
        hiddenNewProduct()
      }
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
                value={newProduct.productName} 
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
                sx={styleTextField} 
              />

              <TextField
                id="outlined-number"
                // select
                name="price"
                label="price"
                type="number"
                value={newProduct.Price}
                InputLabelProps={{
                  shrink: true,
                }}
                value={newProduct.Price}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
                sx={styleTextField}
              />
            
              <TextField
                id="outlined-select-currency"
                select
                name="brand"
                label="brand"
                value={newProduct.brand}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
                sx={styleTextField}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
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
                value={newProduct.category}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                id="outlined-number"
                name="rating"
                label="rating"
                type = "number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newProduct.Rating}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
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
                value={newProduct.quantityInStock}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
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
                    onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
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