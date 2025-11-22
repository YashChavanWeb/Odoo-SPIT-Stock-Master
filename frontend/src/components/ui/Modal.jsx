import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ open, onClose, title, children, maxWidth = 'sm', ...props }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} {...props}>
    {title && (
      <DialogTitle className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
    )}
    <DialogContent dividers>{children}</DialogContent>
  </Dialog>
);

export default Modal;

