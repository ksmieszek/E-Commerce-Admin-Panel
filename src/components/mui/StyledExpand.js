import * as React from "react";
import { styled } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const StyledExpandLess = styled(ExpandLess)(() => ({
  marginLeft: 8,
  width: "20px",
}));

const StyledExpandMore = styled(ExpandMore)(() => ({
  marginLeft: 8,
  width: "20px",
}));

export default function StyledExpand({ listCollapsed }) {
  return listCollapsed ? <StyledExpandLess /> : <StyledExpandMore />;
}
