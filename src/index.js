import React from "react";
import ReactDOM from "react-dom";
import App from "views/App";
import AuthProvider from "hooks/useAuth";
import DialogProvider from "hooks/useDialog";
import SnackbarProvider from "hooks/useSnackbar";

ReactDOM.render(
  <React.StrictMode>
    <DialogProvider>
      <SnackbarProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </DialogProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
