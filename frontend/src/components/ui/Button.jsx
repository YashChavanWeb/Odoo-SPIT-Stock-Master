import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

const variants = {
  primary: 'bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600',
  secondary: 'bg-white text-black border border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700',
  ghost: 'bg-transparent text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
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
      'rounded-xl font-medium capitalize tracking-tight transition-all duration-200 shadow-sm',
      variants[variant],
      sizes[size],
      className
    )}
    {...rest}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : children}
  </MuiButton>
);

export default Button;
