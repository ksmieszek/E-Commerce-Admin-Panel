import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import DeleteDialog from "components/mui/DeleteDialog";

const MainTemplate = (props) => {
  return (
    <>
      {props.children}
      <DeleteDialog />
    </>
  );
};

export default MainTemplate;
