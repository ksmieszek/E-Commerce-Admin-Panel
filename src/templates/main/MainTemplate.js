import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import DeleteDialog from "components/mui/DeleteDialog";
import StyledSnackbar from "components/mui/StyledSnackbar";

const MainTemplate = (props) => {
  return (
    <>
      {props.children}
      <StyledSnackbar />
      <DeleteDialog />
    </>
  );
};

export default MainTemplate;
