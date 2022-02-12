import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import MenuCategoryForm from "components/forms/menuManagement/MenuCategoryForm";
import MenuPodcategory from "./MenuPodcategory";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";
import { useDialog } from "hooks/useDialog";
import DeleteForm from "components/mui/DeleteForm";

const MenuCategory = ({ category, categoriesFields, categoriesReplace, deleteMenuCategory, submitChanges, menuMainKey }) => {
  const { control } = useForm();
  const { fields: podcategoriesFields, replace: podcategoriesReplace } = useFieldArray({ control, name: "podcategories" });

  useEffect(() => {
    const podcategoriesArray = [];
    category.podcategories?.forEach((item) => {
      podcategoriesArray.push({ title: item.title, link: item.link, order: item.order, key: item.key });
    });
    podcategoriesReplace(podcategoriesArray);
  }, []);

  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  const editMenuCategory = (e) => {
    e.stopPropagation();
    const action = (values) => {
      const updatedArray = [...categoriesFields].map((item) => {
        if (item.id === category.id) {
          item.order = values.order;
          item.title = values.title;
        }
        return item;
      });
      categoriesReplace(updatedArray);
      submitChanges();
    };
    setDialogContent(
      <MenuCategoryForm
        action={action}
        editValues={{
          id: category.id,
          order: category.order,
          title: category.title,
          link: category.link,
          key: category.key,
        }}
        menuMainKey={menuMainKey}
        menuCategoryKey={category.key}
        isCategory={true}
      />
    );
    setDialogSize("md");
    setDialogTitle("Manage category");
    openDialog();
  };

  const deleteMenuCategoryAction = (e) => {
    e.stopPropagation();
    const action = () => {
      const updatedArray = [...categoriesFields].filter((item) => item.id !== category.id && item);
      deleteMenuCategory(updatedArray);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item???");
    openDialog();
  };

  const addMenuPodcategory = (e) => {
    e.stopPropagation();
    const action = (values) => {
      const categoriesArrayCopy = [...categoriesFields];
      const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
      const { order, title, link, key } = values;
      const newPodcategoriesArray = [
        ...podcategoriesFields,
        {
          order,
          title,
          link,
          key,
        },
      ];
      categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
      categoriesReplace(categoriesArrayCopy);
      submitChanges();
    };
    setDialogContent(
      <MenuCategoryForm action={action} editValues={{}} menuMainKey={menuMainKey} menuCategoryKey={category.key} isCategory={false} />
    );
    setDialogSize("lg");
    setDialogTitle("Manage podcategory");
    openDialog();
  };

  const editMenuPodcategory = (newPodcategoriesArray) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };

  const deleteMenuPodcategory = (newPodcategoriesArray) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };

  return (
    <>
      <StyledListItemButton onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={category.title} />
        <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteMenuCategoryAction(e)} />
        <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editMenuCategory(e)} />
        <StyledExpand listCollapsed={listCollapsed} />
      </StyledListItemButton>
      <Collapse in={listCollapsed} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItemText primary={`order: ${category.order}`} />
        </List>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItemText primary={`title: ${category.title}`} />
        </List>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItemText primary={`link: ${category.link}`} />
        </List>
        <StyledListItemButton indent={true} onClick={() => setSubListCollapsed(!subListCollapsed)}>
          <ListItemText primary={`podcategories`} />
          <AddIcon fontSize="medium" sx={{ ml: 1 }} onClick={(e) => addMenuPodcategory(e)} />
          {podcategoriesFields.length > 0 && <StyledExpand listCollapsed={subListCollapsed} />}
        </StyledListItemButton>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <Collapse in={subListCollapsed} timeout="auto" unmountOnExit>
            {podcategoriesFields.length > 0 &&
              podcategoriesFields.map((item, index) => (
                <MenuPodcategory
                  key={item.id}
                  podcategory={podcategoriesFields[index]}
                  podcategoriesFields={podcategoriesFields}
                  editMenuPodcategory={editMenuPodcategory}
                  deleteMenuPodcategory={deleteMenuPodcategory}
                  menuCategoryKey={category.key}
                  menuMainKey={menuMainKey}
                />
              ))}
          </Collapse>
        </List>
      </Collapse>
    </>
  );
};

export default MenuCategory;
