import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { useDialog } from "hooks/useDialog";

const DeleteForm = ({ action }) => {
  const { closeDialog } = useDialog();

  return (
    <Stack sx={{ py: 1, px: 1 }}>
      <DialogActions sx={{ mr: 1, mt: 2 }}>
        <Button onClick={closeDialog} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            action();
            closeDialog();
          }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default DeleteForm;
