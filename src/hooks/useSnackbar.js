import { useState, createContext, useContext } from "react";

export const SnackbarContext = createContext();
export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const closeSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return <SnackbarContext.Provider value={{ snackbarState, setSnackbarState, closeSnackbar }}>{children}</SnackbarContext.Provider>;
};

export default SnackbarProvider;
