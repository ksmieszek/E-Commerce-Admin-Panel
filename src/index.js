import React from "react";
import ReactDOM from "react-dom";
import App from "views/App";
import AuthProvider from "hooks/useAuth";
import DialogProvider from "hooks/useDialog";

ReactDOM.render(
  <React.StrictMode>
    <DialogProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DialogProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
