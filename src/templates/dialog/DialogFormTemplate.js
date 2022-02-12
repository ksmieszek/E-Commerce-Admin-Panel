import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import { useDialog } from "hooks/useDialog";

const DialogFormTemplate = ({ children, submit }) => {
  const { closeDialog } = useDialog();

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ pt: 3 }}>
      {children}
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            submit();
            closeDialog();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Box>
  );
};

export default DialogFormTemplate;
