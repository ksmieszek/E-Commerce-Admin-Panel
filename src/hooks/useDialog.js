import { useState, createContext, useContext } from "react";

export const DialogContext = createContext();
export const useDialog = () => useContext(DialogContext);

const DialogProvider = ({ children }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogSize, setDialogSize] = useState(null);

  const closeDialog = () => setDialogIsOpen(false);
  const openDialog = () => setDialogIsOpen(true);

  return (
    <DialogContext.Provider
      value={{
        dialogIsOpen,
        closeDialog,
        openDialog,
        dialogContent,
        setDialogContent,
        dialogTitle,
        setDialogTitle,
        dialogSize,
        setDialogSize,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
