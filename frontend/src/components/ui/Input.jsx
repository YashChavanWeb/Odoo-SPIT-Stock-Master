import TextField from '@mui/material/TextField';
import clsx from 'clsx';

const Input = ({ className, ...props }) => (
  <TextField
    variant="outlined"
    fullWidth
    InputProps={{
      className: clsx('rounded-xl', className),
    }}
    {...props}
  />
);

export default Input;

