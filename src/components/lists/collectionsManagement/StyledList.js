import { useState } from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";

const StyledList = ({ title, fields, addAction, editAction, deleteAction, removeField }) => {
  const [listCollapsed, setListCollapsed] = useState(false);

  return (
    <List
      sx={{
        width: "500px",
        height: "min-content",
        maxWidth: 500,
        overflow: "hidden",
        m: 5,
        pb: 0,
        pt: 0,
        border: 1,
        borderRadius: 3,
        borderColor: "grey.200",
        bgcolor: "#fff",
      }}
      component="div"
      aria-labelledby="nested-list-subheader"
    >
      <StyledListItemButton header={true} onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={title} />
        {deleteAction && <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteAction(e)} />}
        {editAction && <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e)} />}
        <AddIcon sx={{ ml: 1 }} fontSize="medium" onClick={(e) => addAction(e)} />
        {fields.length > 0 && <StyledExpand listCollapsed={listCollapsed} />}
      </StyledListItemButton>
      {fields.length > 0 && (
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ mb: 1 }}>
            {fields.map((item, index) => (
              <StyledListItemButton key={typeof item === "object" ? item.key : item}>
                <ListItemText primary={typeof item === "object" ? `${item.key}: ${item.value}` : item} />
                <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={() => removeField(index)} />
              </StyledListItemButton>
            ))}
          </Collapse>
        </List>
      )}
    </List>
  );
};

export default StyledList;
