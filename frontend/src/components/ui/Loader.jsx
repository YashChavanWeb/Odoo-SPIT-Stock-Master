import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({ message = 'Loading...', fullScreen }) => (
  <Box
    className="flex flex-col items-center justify-center gap-3 text-center"
    sx={{
      minHeight: fullScreen ? '60vh' : 'auto',
      padding: fullScreen ? '4rem' : '1rem',
    }}
  >
    <CircularProgress />
    <p className="text-sm text-muted">{message}</p>
  </Box>
);

export default Loader;

