import SignIn from "templates/mui/signIn/SignIn";
import Box from "@mui/material/Box";

const Login = () => {
  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <SignIn />
    </Box>
  );
};

export default Login;
