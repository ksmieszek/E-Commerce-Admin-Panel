import { useState, createContext, useContext } from "react";

export const SnackbarContext = createContext();
export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snackBarState, setSnackbarState] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const handleClose = () => {
    setSnackbarState({ ...snackBarState, open: false });
  };

  return <SnackbarContext.Provider value={{ snackBarState, setSnackbarState, handleClose }}>{children}</SnackbarContext.Provider>;
};

export default SnackbarProvider;
