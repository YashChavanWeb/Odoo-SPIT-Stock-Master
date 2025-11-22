import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'bg-white text-brand-600 border border-brand-100 hover:border-brand-200',
  ghost: 'bg-transparent text-brand-500 hover:bg-brand-50',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({
  children,
  loading,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}) => (
  <MuiButton
    disableElevation
    className={clsx(
      'rounded-xl capitalize tracking-tight transition-all duration-200',
      variants[variant],
      sizes[size],
      className,
    )}
    {...rest}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : children}
  </MuiButton>
);

export default Button;

