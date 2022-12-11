import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {BrandsService,CategoriesService}from '../Service.js';


const style = {
    width:250,
    bgcolor: '#201f1f',
    border: '2px solid #404040',
    borderRadius: '8px',
    color :'text.primary',
    boxShadow: 24,
    marginTop:'15px', 
}


function BasicTextFields() {

  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [Currency, setCurrency] = React.useState([]);


const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setCurrency(event.target.value);
};

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

    })()
  },[brands,categories])

  return (
    <>
    <Box
        component="form"
        sx={{
          marginTop:'10px',
          width: 'auto',
          display:"flex",
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        noValidate
        autoComplete="off"
    >
      <TextField id="outlined-basic" sx={style} type="text" label="Outlined" variant="outlined" />
    </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            // value={currency}
            // onChange={handleChange}
            helperText="Please select your currency"
            sx={style}
          >
            {brands.map((brand) => (
              <MenuItem key={brand.brandName} value={brand.brandName}>
                {brand.brandName}
              </MenuItem>
            ))}
          </TextField>
      </Box>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            // value={currency}
            // onChange={handleChange}
            helperText="Please select your currency"
            sx={style}
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryName} value={category.categoryName}>
                {category.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >

          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            // value={currency}
            // onChange={handleChange}
            helperText="Please select your currency"
            sx={style}
          >
            {brands.map((brand) => (
              <MenuItem key={brand.brandName} value={brand.brandName}>
                {brand.brandName}
              </MenuItem>
            ))}
          </TextField>
        </Box> */}

        <Box>
          <TextField
            id="outlined-number"
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        </>
  );
}

export default BasicTextFields;