import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {NavLink,useNavigate} from 'react-router-dom';
import { BoxProps } from '@mui/material/Box';
import TextField from './TextField/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import './style.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#201f1f',
  border: '2px solid #808080',
  borderRadius: '16px',
  color :"#ffffff",
  boxShadow: 24,
  p: 2,
};

const EditProduct = ({showEditProduct,hiddenEditProduct,productEditData,changeProduct}) => {
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => (
    setOpen(false),
    setEditProductModal({hiddenModal : true}),
    setEditProductModal({showMessageEditProduct : false}),
    setProgress(0),
    hiddenEditProduct()
  );

  const [editProductModal, setEditProductModal] = React.useState({
    hiddenModal: true ,
    showMessageEditProduct : false,
    showLoader : false,
  });

  React.useEffect(() => {
    setOpen(showEditProduct)
    setEditProductModal({hiddenModal : true})
    setProgress(0)
  },[showEditProduct]);


  // React.useEffect(() => {
  //   const timer = 

  //   return () => {
      
  // },[editProductModal.hiddenModal]);

  const closeContentBox = () => {
    // setProgress(0)
    setTimeout(() => {

      setEditProductModal({hiddenModal : false})

      setTimeout(() => {

        setEditProductModal({showLoader : true})
        let timer = setInterval(() => { 
          setProgress((prevProgress) => (prevProgress >= 100 ?
            (
              setEditProductModal({showLoader : false}), 
              setEditProductModal({showMessageEditProduct : true})
            )
          : 
          prevProgress + 10));
        
        }, 200)

        setTimeout(() => {
          clearInterval(timer)
          setEditProductModal({showMessageEditProduct : true})
          handleClose()
        }, 4000)
      }, 100);
    }, 50)
  }

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <>
            {editProductModal.hiddenModal ?
              <Box sx={style} className="content-box">
                <Box className="content-newProduct">
                  <Typography id="modal-modal-title" className="text-center" variant="h6" component="h2">
                    Edit Data product
                  </Typography>

                  <TextField productEditData={productEditData} hiddenEditProduct={closeContentBox} />
                </Box>
              </Box>
            :''}  

          {editProductModal.showLoader? 
            <Box sx={style} className="content-box2">
              <Stack spacing={2} direction="row mx-auto">
                <CircularProgress color="inherit" variant="determinate" value={progress} />
              </Stack> 
            </Box>
          : ""}

          {editProductModal.showMessageEditProduct ? 
            <Box sx={style} className="content-box2">
              <Box className="content-newProduct-Message">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    This Product's Edit
                </Typography>
              </Box>
            </Box>
          : ''}
          
          </>
      </Modal> 
  );
};

export default EditProduct;