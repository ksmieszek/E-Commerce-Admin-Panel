import { useState } from "react";
import MenuForm from "./MenuForm";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";

const MenuPodcategory = ({ podcategory, podcategoriesFields, deletePodcategory, editPodcategory }) => {
  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);
  const [listCollapsed, setListCollapsed] = useState(false);

  const deleteItem = () => {
    const updatedArray = [...podcategoriesFields].filter((item) => item.id !== podcategory.id && item);
    deletePodcategory(updatedArray);
  };
  const editItem = (values) => {
    const updatedArray = [...podcategoriesFields].map((item) => {
      if (item.id === podcategory.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
      }
      return item;
    });
    setShowForm(false);
    editPodcategory(updatedArray);
  };

  const deleteAction = (e) => {
    e.stopPropagation();
    deleteItem();
  };
  const editAction = (e) => {
    e.stopPropagation();
    setEditItemValues({
      order: podcategory.order,
      title: podcategory.title,
      link: podcategory.link,
    });
    setShowForm(true);
  };

  return (
    <>
      <StyledListItemButton onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={podcategory.title} />
        <DeleteIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => deleteAction(e)} />
        <EditIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => editAction(e)} />
        <StyledExpand listCollapsed={listCollapsed} />
      </StyledListItemButton>
      <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ pl: 4 }}>
        <List component="div" disablePadding>
          <ListItemText primary={`order: ${podcategory.order}`} />
        </List>
        <List component="div" disablePadding>
          <ListItemText primary={`title: ${podcategory.title}`} />
        </List>
        <List component="div" disablePadding>
          <ListItemText primary={`link: ${podcategory.link}`} />
        </List>
      </Collapse>
      {showForm && <MenuForm save={editItem} setShowForm={setShowForm} editValues={editItemValues} />}
    </>
  );
};

export default MenuPodcategory;