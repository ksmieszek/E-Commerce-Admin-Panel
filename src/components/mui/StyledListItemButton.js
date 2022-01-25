import { ListItemButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "indent" && prop !== "header",
})(({ indent, header }) => ({
  ...(!header && {
    paddingTop: "2px",
    paddingBottom: "2px",
  }),
  ...(indent && {
    paddingLeft: "32px",
  }),
  "&:hover": {
    backgroundColor: "#ddd",
  },
}));

export default StyledListItemButton;
