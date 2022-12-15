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
    let errorsProduct = {}
    Object.keys(newProduct).forEach((item) =>{
        errorsProduct[item] = []
        if(newData[item].length === 0 || newData[item] === 0){
            switch (item) {
              case "productName":
                // errorsProduct[item] = []
                errorsProduct[item].push("There is no product name") 
                break;
              case "price":
                // errorsProduct[item] = []
                errorsProduct[item].push("The price for the product has not been specified")
                break;
              case "brandId":
                // errorsProduct[item] = []
                errorsProduct[item].push("A brand has not been specified for the product")
                break;
              case "categoryId":
                // errorsProduct[item] = []
                errorsProduct[item].push("Category is not specified for the product")
                break;
              case "rating":
                // errorsProduct[item] = []
                errorsProduct[item].push("Product rating is not specified")
                break;
              case "quantityInStock":
                // errorsProduct[item] = []
                errorsProduct[item].push("The product number is not specified")
                break;
              case "image":
                // errorsProduct[item] = []
                errorsProduct[item].push("There is no photoooooooooo")
                break;  

                // default : setErrors({...errors})
            }
            valid = false
          }
        }
        ) 
        setErrors(errorsProduct)
        console.log("errorsProduct",errorsProduct)
      
    return valid
  }

  const addNewProduct = async () => {
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
                // helperText={errors.productName?errors.productName:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.productName} 
                sx={styleTextField} 
              />
              {errors.productName && errors.productName.length>=0?<p className="text-orange-400">{errors.productName}</p>:""}

              <TextField
                id="outlined-number"
                // select
                name="price"
                label="price"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.price?errors.price:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.price}
                sx={styleTextField}
              />
              {errors.price && errors.price.length>0?<p className="text-orange-400">{errors.price}</p>:""}
            
              <TextField
                id="outlined-select-currency"
                select
                name="brandId"
                label="brandId"
                // helperText={errors.brandId?errors.brandId:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.brandId}
                sx={styleTextField}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </TextField>
              {errors.brandId && errors.brandId.length>0?<p className="text-orange-400">{errors.brandId}</p>:""}
            
              <TextField
                id="outlined-select-currency"
                select
                label="categoryId"
                name="categoryId"
                // helperText={errors.categoryId?errors.categoryId:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.categoryId}
                sx={styleTextField}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>
              {errors.categoryId && errors.categoryId.length>0 ? <p className="text-orange-400">{errors.categoryId}</p>:""}
              
              <TextField
                id="outlined-number"
                name="rating"
                label="rating"
                type = "number"
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.rating?errors.rating:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.rating}
                sx={styleTextField}
              />
              {errors.rating && errors.rating.length>0 ? <p className="text-orange-400">{errors.rating}</p>:""}
              <TextField
                id="outlined-number"
                name="quantityInStock"
                label="quantityInStock"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.quantityInStock?errors.quantityInStock:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.quantityInStock}
                sx={styleTextField}
              />
              {errors.quantityInStock && errors.quantityInStock.length>=0 ? <p className="text-orange-400">{errors.quantityInStock}</p>:""}
         
              <Button
                  variant="contained"
                  component="label"
                  sx={{backgroundColor: "green"}}
                >
                  Upload File
                  <input
                    type="file"
                    name="image"
                    onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                    hidden
                />
              </Button>
              {errors.image && errors.image.length>=0 ? <p className="text-orange-400">{errors.image}</p>:""}

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