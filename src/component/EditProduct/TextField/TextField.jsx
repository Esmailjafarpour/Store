import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {BrandsService,CategoriesService}from '../../../Service.js';
import {NavLink,useNavigate} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

const styleSelect = {
    '& .MuiTextField-root': { m: 1, width: '25ch',borderColor : 'red' },
    width:220,
    height: "auto",
    bgcolor: '#201f1f',
    border: '2px solid #404040',
    borderRadius: '8px',
    boxShadow: 24,
    margin:'10px 0px',
    color : "white",
    label : {color: 'white',fontSize :14,marginButton:2},
    input: { color: 'white',fontSize :14},
    div: { color: 'white',fontSize :14 }
}

function BasicTextFields({hiddenEditProduct,productEditData}) {

  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [Currency, setCurrency] = React.useState([]);
  const [newProduct, setNewProduct] = React.useState({
    productName:productEditData.productName,
    price:productEditData.price,
    brandId:productEditData.brandId,
    categoryId:productEditData.categoryId,
    rating:productEditData.rating,
    quantityInStock:productEditData.quantityInStock,
    image:productEditData.image,
    discount:productEditData.discount
});

const [errors, setErrors] = React.useState({
    productName:[],
    price:[],
    brandId:[],
    categoryId:[],
    rating:[],
    quantityInStock:[],
    image:[],
    discount:[]
});

const [dirty, setDirty] = React.useState({
  email:false,
  password:false,
  fullName:false,
  dateOfBrith:false,
  gender:false,
  country:false,
  recieveNewsLetters:false,
  discount:false
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

        // let allBrand = brands.filter((brand)=>
        //     setEdit(brand.id === editDataProduct.brandId?brand.brandName:"")
        // )
        // console.log(productEditData)

      })();
  },[newProduct])

  const isValid = () => {
    let valid = true
    let newData = newProduct;
    let errorsProduct = {}
    Object.keys(newProduct).forEach((item) =>{
            errorsProduct[item] = []
            if(newData[item].length >= 0 || newData[item] >= 0){
              switch (item) {
                case "productName":
                  if(newData[item].length === 0){
                    errorsProduct[item].push("There is no product name") 
                    valid = false
                  }
                  
                  if(newData[item].length > 0 && newData[item].length < 2){
                    errorsProduct[item].push("Product name must be more than two characters")
                    valid = false  
                  }

                  if(newData[item].length > 30){
                    errorsProduct[item].push("Product name should not be more than 30 characters")
                    valid = false  
                  }
                  
                  break;

                case "price":

                  if(newData[item] < 0){
                    errorsProduct[item].push("The price of the product must be more than 1000 dollars") 
                    valid = false 
                  }
                  if(newData[item] === 0){
                    errorsProduct[item].push("The price for the product has not been specified") 
                    valid = false 
                  }

                  if(newData[item] < 1000 ){
                    errorsProduct[item].push("The minimum price of the product is 1000 dollars") 
                    valid = false
                  }
                  
                  if(newData[item] > 20000000 ){
                    errorsProduct[item].push("Currently, we do not register products with a price higher than 20000000") 
                    valid = false
                  }
                  
                  break;
                case "brandId":
                  if(newData[item] === 0){
                    errorsProduct[item].push("A brand has not been specified for the product")
                    valid = false
                  }
                  break;
                case "categoryId":
                  if(newData[item] === 0){
                    errorsProduct[item].push("Category is not specified for the product")
                    valid = false
                  }
                  break;
                case "rating":
                  if(newData[item] === 0){
                    errorsProduct[item].push("The score must be greater than zero") 
                    valid = false
                  }
                  if(newData[item] > 5){
                    errorsProduct[item].push("The score of the products should not be more than 5") 
                    valid = false
                  }
                  break;
                case "quantityInStock":
                  if(newData[item] === 0){
                    errorsProduct[item].push("The product number is not specified") 
                    valid = false
                  }
                  if(newData[item] < 5){
                    errorsProduct[item].push("The number of products should not be less than 5") 
                    valid = false
                  }
                  if(newData[item] > 1000000){
                    errorsProduct[item].push("The number of products should not exceed 999,999") 
                    valid = false
                  }
                  break;
                case "image":
                  if(newData[item] === ''){
                    errorsProduct[item].push("There is no photo")
                    valid = false
                  }
                
                  default : setErrors(errorsProduct)  
              }
            }
          }
        ) 
        setErrors(errorsProduct)
    return valid
  }

  const editProduct = async () => {
    if(isValid()){
        let response = await fetch(`http://localhost:5000/products/${productEditData.id}`, {
          method : "PUT",
          body : JSON.stringify({
            productName : newProduct.productName,
            price : newProduct.price,
            brandId : newProduct.brandId,
            categoryId : newProduct.categoryId,
            rating : newProduct.rating,
            quantityInStock : newProduct.quantityInStock,
            discount : newProduct.discount,
            image : newProduct.image,
          }),
          headers : {
              "Content-type": "application/json",
          },
        });
        await hiddenEditProduct()

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
                InputProps={{ inputProps: { min: 2, max: 30 } }}
                // helperText={errors.productName?errors.productName:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.productName} 
                sx={styleTextField} 
              />
              {errors.productName && errors.productName.length>=0?<p className="text-amber-300 text-[12px] mt-1">{errors.productName}</p>:""}

              <TextField
                id="outlined-number"
                // select
                name="price"
                label="price"
                type="number"
                InputProps={{ inputProps: { min: 1000, max: 20000000 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.price?errors.price:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.price}
                sx={styleTextField}
              />
              {errors.price && errors.price.length>0?<p className="text-amber-300 text-[12px] mt-1">{errors.price}</p>:""}
              
              <FormControl >
                <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="outlined-select-currency"
                  name="brandId"
                  label="brandId"
                  value={newProduct.brandId}
                  onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                  // sx={styleTextField}
                  sx={styleSelect}
                >
                   
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {errors.brandId && errors.brandId.length>0?<p className="text-amber-300 text-[12px] mt-1">{errors.brandId}</p>:""}

              <FormControl >
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="outlined-select-currency"
                  label="categoryId"
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value}),isValid())}
                  // sx={styleTextField}
                  sx={styleSelect}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.categoryId && errors.categoryId.length>0 ? <p className="text-amber-300 text-[12px] mt-1">{errors.categoryId}</p>:""}
              
              <TextField
                id="outlined-number"
                name="rating"
                label="rating"
                type = "number"
                InputProps={{ inputProps: { min: 0, max: 5 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.rating?errors.rating:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.rating}
                sx={styleTextField}
              />
              {errors.rating && errors.rating.length>=0 ? <p className="text-amber-300 text-[12px] mt-1">{errors.rating}</p>:""}
              <TextField
                id="outlined-number"
                name="quantityInStock"
                label="quantityInStock"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 1000000 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.quantityInStock?errors.quantityInStock:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.quantityInStock}
                sx={styleTextField}
              />
              {errors.quantityInStock && errors.quantityInStock.length>=0 ? <p className="text-amber-300 text-[12px] mt-1">{errors.quantityInStock}</p>:""}
         
              <TextField
                id="outlined-number"
                name="discount"
                label="discount"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                // helperText={errors.quantityInStock?errors.quantityInStock:""}
                onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:Number(e.target.value)}),isValid())}
                onBlur={()=>isValid()}
                value={newProduct.discount}
                sx={styleTextField}
              />
              <Button
                  variant="contained"
                  component="label"
                  sx={{backgroundColor: "green"}}
                  // onClick={()=>errors.image && errors.image.length ===0 ? isValid():""}
                >
                  Upload File
                  
                  <input
                    type="file"
                    name="image"
                    onChange={(e)=> (setNewProduct({...newProduct,[e.target.name]:e.target.value.slice(12, e.target.value.length)})
                    )}
                    hidden
                />
              </Button>
              
              {errors.image && errors.image.length >=0 ? <p className="text-amber-300 text-[12px] mt-1">{errors.image}</p>:""}
              
              <Box className="mt-2 flex justify-center">
                <Button type="button" className="focus:outline-none text-white bg-green-900 hover:bg-green-800 
                      focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 
                      dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      onClick={()=> editProduct() }
                      >
                        Edit Product
                    {/* <NavLink className="nav-link" activeclassname="active" aria-current="page" to="#!">
                          
                    </NavLink> */}
                </Button>
            </Box>    
          </Box>
  );
}

export default BasicTextFields;