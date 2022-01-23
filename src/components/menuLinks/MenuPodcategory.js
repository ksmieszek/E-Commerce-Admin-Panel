import styled from "styled-components";
import { useState } from "react";
import MenuForm from "./MenuForm";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledWrapper = styled.div`
  background: grey;
  padding: 10px;
  margin: 20px;
`;

const StyledCategory = styled.div`
  background: lightgray;
  padding: 20px;
`;

const MenuPodcategory = ({ podcategory, podcategoriesFields, deletePodcategory, editPodcategory }) => {
  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);

  const deleteItem = () => {
    const changedArr = [...podcategoriesFields].filter((item) => item.id !== podcategory.id && item);
    deletePodcategory(changedArr);
  };
  const editItem = (values) => {
    const changedArr = [...podcategoriesFields].map((item) => {
      if (item.id === podcategory.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
        return item;
      }
      return item;
    });
    setShowForm(false);
    editPodcategory(changedArr);
  };

  const [listCollapsed, setListCollapsed] = useState(false);
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
      <ListItemButton onClick={() => setListCollapsed(!listCollapsed)} sx={{ pt: `2px`, pb: `2px` }}>
        <ListItemText primary={podcategory.title} />
        <DeleteIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => deleteAction(e)} />
        <EditIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => editAction(e)} />
        {listCollapsed ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

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
