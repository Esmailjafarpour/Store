
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {NavLink,useNavigate} from 'react-router-dom';
import { BoxProps } from '@mui/material/Box';
import TextField from './TextField';

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

const NewProduct  = ({showNewProduct,hiddenNewProduct}) => {
  const [open, setOpen] = React.useState(false);
  const [newProductModalChanges, setNewProductModalChanges] = React.useState({
    classHidden : '',
    hiddenModal: true ,
    hiddenNewProduct : true,
    showMessageCreateProduct : false
  });
  const handleOpen = () => setOpen();
  const handleClose = () => (
    hiddenNewProduct(),
    setOpen(false)
  );

  const closeContentBox = () => {

    // setNewProductModalChanges({classHidden : "hiddenContentBox"})

        setTimeout(() => {

          setNewProductModalChanges({hiddenModal : false})
          
          setTimeout(() => {
            
            setNewProductModalChanges({showMessageCreateProduct : true})
                    setTimeout(() => {
                    // setNewProductModalChanges({classHidden : null})
                    setNewProductModalChanges({hiddenModal : true})
                    setNewProductModalChanges({showMessageCreateProduct : false})
                    setOpen(false)
                    hiddenNewProduct()

                  }, 1000)

            }, 200);

        }, 100)

  }

  React.useEffect(() => {
    setOpen(showNewProduct)
  },[showNewProduct]);

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <>
            {newProductModalChanges.hiddenModal ?
              <Box sx={style} className={`content-box ${newProductModalChanges.classHidden}`}>
                <div className="content-newProduct">
                  <Typography id="modal-modal-title" className="text-center" variant="h6" component="h2">
                    Create your new product
                  </Typography>

                  <TextField hiddenNewProduct={closeContentBox}/>
                </div>
              </Box>
            :''} 

          {newProductModalChanges.showMessageCreateProduct ? 
            <Box sx={style} className="content-box2">
              <div className="content-newProduct-Message">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Your product has been added
                </Typography>
              </div>
            </Box>
          : ''}
          </>
      </Modal> 
  );
};

export default NewProduct;