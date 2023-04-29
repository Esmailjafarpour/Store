import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Login from '../Atentication/Login';
import {NavLink,useNavigate} from 'react-router-dom';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#201f1f',
  border: '2px solid #868685',
  borderRadius: '16px',
  color :"#ffffff",
  boxShadow: 24,
  p: 2,
};

const ModalComponents = ({showLoginMessage,hiddenLoginMessage,children}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => (
    setOpen(false),
    hiddenLoginMessage()
  );

  React.useEffect(() => {
    {showLoginMessage?handleOpen():handleClose()}
  },[showLoginMessage]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You must {children} before you want to make a purchase
          </Typography>
          <Typography id="modal-modal-description" className="flex justify-center" sx={{ mt: 2 }}>
            <button type="button" className="focus:outline-none text-white bg-green-900 hover:bg-green-800 
              focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 
              dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <NavLink className="nav-link" activeclassname="active" aria-current="page" to={`/${children}`}>
                <i className="fa fa-sign-in" aria-hidden="true"></i>
                      {children}
                </NavLink>
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponents;