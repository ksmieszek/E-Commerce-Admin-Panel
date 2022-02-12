import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import StyledDialog from "templates/dialog/StyledDialog";
import StyledSnackbar from "components/mui/StyledSnackbar";

const MainTemplate = (props) => {
  return (
    <>
      {props.children}
      <StyledSnackbar />
      <StyledDialog />
    </>
  );
};

export default MainTemplate;
