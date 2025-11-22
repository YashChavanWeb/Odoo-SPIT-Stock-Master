import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import clsx from 'clsx';

const Card = ({ children, className, padding = 'p-6', ...props }) => (
  <MuiCard
    className={clsx(
      'bg-white dark:bg-slate-800 shadow-soft border border-slate-100 dark:border-slate-700',
      className,
    )}
    elevation={0}
    {...props}
  >
    <MuiCardContent className={clsx('flex flex-col gap-4', padding)}>{children}</MuiCardContent>
  </MuiCard>
);

export default Card;

