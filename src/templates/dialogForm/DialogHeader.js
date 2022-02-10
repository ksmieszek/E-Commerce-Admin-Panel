import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const DialogHeader = ({ title, onClose }) => (
  <DialogTitle sx={{ m: 0, py: 2, px: 3, color: (theme) => theme.palette.grey[700] }}>
    {title}
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: "absolute",
        right: 13,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
);
export default DialogHeader;
