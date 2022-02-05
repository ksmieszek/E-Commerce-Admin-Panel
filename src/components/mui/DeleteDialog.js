import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useDialog } from "hooks/useDialog";

const DeleteDialog = () => {
  const { openDialog, setOpenDialog, dialogAction } = useDialog();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const executeAction = () => {
    dialogAction();
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <Stack sx={{ py: 1, px: 1 }}>
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: 20, fontWeight: 400 }}>
          Are you sure you want to delete this item?
        </DialogTitle>
        <DialogActions sx={{ mr: 1, mt: 2 }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={executeAction} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

export default DeleteDialog;
