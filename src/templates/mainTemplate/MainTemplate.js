import Dashboard from "templates/mui/dashboard/Dashboard";
// import GlobalStyles from "@mui/material/GlobalStyles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const MainTemplate = (props) => {
  return (
    <>
      {/* <GlobalStyles styles={{ h1: { color: "red" } }} /> */}
      <Dashboard>{props.children}</Dashboard>
    </>
  );
};

export default MainTemplate;
