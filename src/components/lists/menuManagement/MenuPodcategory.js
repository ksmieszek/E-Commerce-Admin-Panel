import { useState } from "react";
import MenuCategoryForm from "components/forms/menuManagement/MenuCategoryForm";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";
import { useDialog } from "hooks/useDialog";

const MenuPodcategory = ({ podcategory, podcategoriesFields, deletePodcategory, editPodcategory, menuCategoryKey, menuMainKey }) => {
  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState({});
  const [listCollapsed, setListCollapsed] = useState(false);
  const { setOpenDialog, setDialogAction } = useDialog();

  const editItem = (values) => {
    const updatedArray = [...podcategoriesFields].map((item) => {
      if (item.id === podcategory.id) {
        item.order = values.order;
        item.title = values.title;
      }
      return item;
    });
    setShowForm(false);
    editPodcategory(updatedArray);
  };
  const deleteItem = (e) => {
    e.stopPropagation();
    setDialogAction(() => () => {
      const updatedArray = [...podcategoriesFields].filter((item) => item.id !== podcategory.id && item);
      deletePodcategory(updatedArray);
    });
    setOpenDialog(true);
  };

  const editAction = (e) => {
    e.stopPropagation();
    setEditItemValues({
      id: podcategory.id,
      order: podcategory.order,
      title: podcategory.title,
      link: podcategory.link,
      key: podcategory.key,
    });
    setShowForm(true);
  };

  return (
    <>
      <StyledListItemButton onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={podcategory.title} />
        <DeleteIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => deleteItem(e)} />
        <EditIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => editAction(e)} />
        <StyledExpand listCollapsed={listCollapsed} />
      </StyledListItemButton>
      <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ pl: 4 }}>
        <List component="div" disablePadding>
          <ListItemText primary={`order: ${podcategory.order}`} />
        </List>
        <List component="div" disablePadding>
          <ListItemText primary={`order: ${podcategory.title}`} />
        </List>
        <List component="div" disablePadding>
          <ListItemText primary={`link: ${podcategory.link}`} />
        </List>
      </Collapse>
      {showForm && (
        <MenuCategoryForm
          save={editItem}
          setShowForm={setShowForm}
          editValues={editItemValues}
          menuCategoryKey={menuCategoryKey}
          menuMainKey={menuMainKey}
          isCategory={false}
        />
      )}
    </>
  );
};

export default MenuPodcategory;
