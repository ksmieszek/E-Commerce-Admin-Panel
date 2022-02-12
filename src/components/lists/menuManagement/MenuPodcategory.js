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
import DeleteForm from "components/mui/DeleteForm";

const MenuPodcategory = ({ podcategory, podcategoriesFields, editMenuPodcategory, deleteMenuPodcategory, menuCategoryKey, menuMainKey }) => {
  const [listCollapsed, setListCollapsed] = useState(false);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  const deleteMenuPodcategoryAction = (e) => {
    e.stopPropagation();
    const action = () => {
      const updatedArray = [...podcategoriesFields].filter((item) => item.id !== podcategory.id && item);
      deleteMenuPodcategory(updatedArray);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  const editMenuPodcategoryAction = (e) => {
    e.stopPropagation();
    const editItem = (values) => {
      const updatedArray = [...podcategoriesFields].map((item) => {
        if (item.id === podcategory.id) {
          item.order = values.order;
          item.title = values.title;
        }
        return item;
      });
      editMenuPodcategory(updatedArray);
    };
    setDialogContent(
      <MenuCategoryForm
        action={editItem}
        editValues={{
          id: podcategory.id,
          order: podcategory.order,
          title: podcategory.title,
          link: podcategory.link,
          key: podcategory.key,
        }}
        menuCategoryKey={menuCategoryKey}
        menuMainKey={menuMainKey}
        isCategory={false}
      />
    );
    setDialogSize("md");
    setDialogTitle("Manage podcategory");
    openDialog();
  };

  return (
    <>
      <StyledListItemButton onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={podcategory.title} />
        <DeleteIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => deleteMenuPodcategoryAction(e)} />
        <EditIcon sx={{ ml: 1 }} fontSize="small" onClick={(e) => editMenuPodcategoryAction(e)} />
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
    </>
  );
};

export default MenuPodcategory;
