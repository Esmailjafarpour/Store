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

const [errors, setErrors] = React.useState({});

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
        console.log("..........")
        console.log(item)
        console.log(newData[item].length === 0)
        console.log(newData[item] === 0)

        if(newData[item].length === 0 || newData[item] === 0){
            console.log(">>>>>>>>>>>>")
            switch (item) {
              case "productName":
                console.log("There is no product name")
                setErrors({...errors,[item] : "There is no product name"})
                break;
              case "price":
                console.log("The price for the product has not been specified")
                setErrors({...errors,[item] : "The price for the product has not been specified"})
                break;
              case "brandId":
                console.log("A brand has not been specified for the product")
                setErrors({...errors,[item] : "A brand has not been specified for the product"})
                break;
              case "categoryId":
                console.log("Category is not specified for the product")
                setErrors({...errors,[item] : "Category is not specified for the product"})
                break;
              case "rating":
                console.log("Product rating is not specified")
                setErrors({...errors,[item] : "Product rating is not specified"})
                break;
              case "quantityInStock":
                console.log("The product number is not specified")
                setErrors({...errors,[item] : "The product number is not specified"})
                break;
              case "image":
                console.log("There is no photoooooooooo")
                setErrors({...errors,[item] : "There is no photo"})
                break;  

                // default : setErrors({...errors})
            }
            valid = false
          }
        }
      ) 
      console.log(errors)
      
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
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
                value={newProduct.productName} 
                sx={styleTextField} 
              />
              {errors.productName && errors.productName.length>=0?<p style={{color : "red"}}>{errors.productName}</p>:""}

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
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
                value={newProduct.price}
                sx={styleTextField}
              />
              {errors.price && errors.price.length>0?<p style={{color : "red"}}>{errors.price}</p>:""}
            
              <TextField
                id="outlined-select-currency"
                select
                name="brandId"
                label="brandId"
                // helperText={errors.brandId?errors.brandId:""}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
                value={newProduct.brandId}
                sx={styleTextField}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </TextField>
              {errors.brandId && errors.brandId.length>0?<p style={{color : "red"}}>{errors.brandId}</p>:""}
            
              <TextField
                id="outlined-select-currency"
                select
                label="categoryId"
                name="categoryId"
                // helperText={errors.categoryId?errors.categoryId:""}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:e.target.value})}
                value={newProduct.categoryId}
                sx={styleTextField}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>
              {errors.categoryId && errors.categoryId.length>0 ? <p style={{color : "red"}}>{errors.categoryId}</p>:""}
              
              <TextField
                id="outlined-number"
                name="rating"
                label="rating"
                type = "number"
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.rating?errors.rating:""}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
                value={newProduct.rating}
                sx={styleTextField}
              />
              {errors.rating && errors.rating.length>0 ? <p style={{color : "red"}}>{errors.rating}</p>:""}
              <TextField
                id="outlined-number"
                name="quantityInStock"
                label="quantityInStock"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.quantityInStock?errors.quantityInStock:""}
                onChange={(e)=> setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)})}
                value={newProduct.quantityInStock}
                sx={styleTextField}
              />
              {errors.quantityInStock && errors.quantityInStock.length>=0 ? <p style={{color : "red"}}>{errors.quantityInStock}</p>:""}
         
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
              {errors.image && errors.image.length>=0 ? <p style={{color : "green"}}>{errors.image}</p>:""}

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