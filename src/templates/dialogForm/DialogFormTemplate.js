import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import DialogHeader from "./DialogHeader";

const DialogFormTemplate = ({ children, onClose, maxWidth, title, submit }) => {
  return (
    <Dialog
      open={true}
      fullWidth={true}
      maxWidth={maxWidth}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogHeader title={title} onClose={onClose} />
      <Box component="form" noValidate autoComplete="off" sx={{ pt: 3 }}>
        {children}
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => submit()}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DialogFormTemplate;
