import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "hooks/useSnackbar";

const StyledSnackbar = () => {
  const { snackbarState, closeSnackbar } = useSnackbar();

  return (
    <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity={snackbarState.severity} variant="filled">
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default StyledSnackbar;
