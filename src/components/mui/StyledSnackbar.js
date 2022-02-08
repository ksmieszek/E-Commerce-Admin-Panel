import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "hooks/useSnackbar";

const StyledSnackbar = () => {
  const { snackBarState, handleClose } = useSnackbar();

  return (
    <Snackbar
      open={snackBarState.open}
      autoHideDuration={6000}
      onClose={() => handleClose()}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={snackBarState.severity} variant="filled">
        {snackBarState.message}
      </Alert>
    </Snackbar>
  );
};

export default StyledSnackbar;
