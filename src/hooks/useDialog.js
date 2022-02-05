import { useState, createContext, useContext } from "react";

export const DialogContext = createContext();
export const useDialog = () => useContext(DialogContext);

const DialogProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(() => {});

  return <DialogContext.Provider value={{ openDialog, setOpenDialog, dialogAction, setDialogAction }}>{children}</DialogContext.Provider>;
};

export default DialogProvider;
