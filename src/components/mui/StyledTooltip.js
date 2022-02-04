import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

const StyledTooltip = ({ textToCopy, children }) => {
  const [title, setTitle] = useState("Click to copy");
  const copied = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
    setTitle("Copied");
    setTimeout(() => {
      setTitle("Click to copy");
    }, 1500);
  };
  return (
    <Tooltip placement="top" leaveDelay={500} title={title} onClick={(e) => copied(e)}>
      {children}
    </Tooltip>
  );
};

export default StyledTooltip;
