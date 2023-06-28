import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import BootstrapDialogTitle from 'src/components/bootstrap-dialog-title/modal-notification';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalConfirmation({
  body, title, handleConfirm, handleClose, open,
}) {
  return (
    <BootstrapDialog
      onClose={handleClose}
      data-testid="confirm-dialog"
      aria-labelledby="confirm-dialog"
      open={open}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '500px', // Set your width here
          },
        },
      }}
    >
      <BootstrapDialogTitle id="customized-dialog" onClose={handleClose}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {body}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button autoFocus onClick={handleConfirm}>
          Accept
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

ModalConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  body: PropTypes.string,
};
ModalConfirmation.defaultProps = {
  body: '',
};
