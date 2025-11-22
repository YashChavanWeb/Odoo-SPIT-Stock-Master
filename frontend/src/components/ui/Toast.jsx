import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Toast = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 4000,
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Toast;

