import Dialog from "@mui/material/Dialog";
import { useDialog } from "hooks/useDialog";
import DialogHeader from "templates/dialog/DialogHeader";

const StyledDialog = () => {
  const { dialogIsOpen, closeDialog, dialogContent, dialogTitle, dialogSize } = useDialog();

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth={true}
      maxWidth={dialogSize}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogHeader onClose={closeDialog} title={dialogTitle} />
      {dialogContent}
    </Dialog>
  );
};

export default StyledDialog;
