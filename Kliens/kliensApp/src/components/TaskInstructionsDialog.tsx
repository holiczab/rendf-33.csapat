import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import InfoIcon from '@mui/icons-material/Info';

export default function TaskInstructionsDialog(Data: any) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log("INSTRUCTIONS:\n" + Data.Instruction)
  };

  const handleClose = () => {
    setOpen(false);
    Data.resetSelection();
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Fab
        variant="extended"
        color="success"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{ m: 1 }}
      >
        <InfoIcon sx={{ mr: 1 }} />
        Instructions
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Maintenance Instructions</DialogTitle>
        <DialogContent dividers={true} >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            style={{whiteSpace: 'pre-line'}}
          >
            {Data.Instruction}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
