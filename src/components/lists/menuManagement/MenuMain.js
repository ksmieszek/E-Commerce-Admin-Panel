import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import MenuCategory from "./MenuCategory";
import MenuCategoryForm from "components/forms/menuManagement/MenuCategoryForm";
import MenuMainForm from "components/forms/menuManagement/MenuMainForm";
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

const MenuMain = ({ menuMain, deleteMenuMain, menusReplace, menusFields, submitAllMenus }) => {
  const { handleSubmit, control } = useForm();
  const { fields: categoriesFields, replace: categoriesReplace } = useFieldArray({ control, name: "categories" });
  const onSubmit = () => {
    const updatedArray = [...menusFields].map((item) => {
      if (item.id === menuMain.id) item.categories = categoriesFields;
      return item;
    });
    menusReplace(updatedArray);
    submitAllMenus();
  };
  const submitMenuMain = () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const categoriesArray = [];
    menuMain.categories?.forEach((item) => {
      categoriesArray.push({ title: item.title, link: item.link, order: item.order, podcategories: item.podcategories || [], key: item.key });
    });
    categoriesReplace(categoriesArray);
  }, []);

  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  const editMenuMain = (e) => {
    e.stopPropagation();
    const action = (values) => {
      const updatedArray = [...menusFields].map((item) => {
        if (item.id === menuMain.id) {
          item.order = values.order;
          item.title = values.title;
        }
        return item;
      });
      menusReplace(updatedArray);
      submitAllMenus();
    };
    setDialogContent(
      <MenuMainForm
        action={action}
        editValues={{
          id: menuMain.id,
          order: menuMain.order,
          title: menuMain.title,
          link: menuMain.link,
          key: menuMain.key,
        }}
        menuMainKey={menuMain.key}
      />
    );
    setDialogSize("md");
    setDialogTitle("Manage main category");
    openDialog();
  };

  const deleteMenuMainAction = (e) => {
    e.stopPropagation();
    const action = () => {
      deleteMenuMain(menuMain.id);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  const addMenuCategory = (e) => {
    e.stopPropagation();
    const action = (values) => {
      const menusArrayCopy = [...menusFields];
      const menuMainIndex = menusFields.findIndex((item) => item.id === menuMain.id);
      const { order, title, link, key } = values;
      const newCategoriesArray = [
        ...categoriesFields,
        {
          order,
          title,
          link,
          key,
          podcategories: [],
        },
      ];
      menusArrayCopy[menuMainIndex].categories = newCategoriesArray;
      menusReplace(menusArrayCopy);
      submitAllMenus();
    };
    setDialogContent(<MenuCategoryForm action={action} editValues={{}} menuMainKey={menuMain.key} isCategory={true} />);
    setDialogSize("lg");
    setDialogTitle("Manage category");
    openDialog();
  };

  const deleteMenuCategory = (newCategoriesArray) => {
    const menusArrayCopy = [...menusFields];
    const menuMainIndex = menusFields.findIndex((item) => item.id === menuMain.id);
    menusArrayCopy[menuMainIndex].categories = newCategoriesArray;
    menusReplace(menusArrayCopy);
    submitAllMenus();
  };

  return (
    <>
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
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <StyledListItemButton header={true} onClick={() => setListCollapsed(!listCollapsed)}>
          <ListItemText primary={menuMain.title} />
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteMenuMainAction(e)} />
          <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editMenuMain(e)} />
          <StyledExpand listCollapsed={listCollapsed} />
        </StyledListItemButton>
        <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ mb: 1 }}>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText>order: {menuMain.order}</ListItemText>
          </List>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText primary={`title: ${menuMain.title}`} />
          </List>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText primary={`link: ${menuMain.link}`} />
          </List>
          <StyledListItemButton indent={true} onClick={() => setSubListCollapsed(!subListCollapsed)}>
            <ListItemText primary={`categories`} />
            <AddIcon sx={{ ml: 1 }} fontSize="medium" onClick={(e) => addMenuCategory(e)} />
            {categoriesFields.length > 0 && <StyledExpand listCollapsed={subListCollapsed} />}
          </StyledListItemButton>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <Collapse in={subListCollapsed} timeout="auto" unmountOnExit>
              {categoriesFields.map((item, index) => (
                <MenuCategory
                  key={item.id}
                  category={categoriesFields[index]}
                  categoriesFields={categoriesFields}
                  categoriesReplace={categoriesReplace}
                  submitChanges={submitMenuMain}
                  deleteMenuCategory={deleteMenuCategory}
                  menuMainKey={menuMain.key}
                />
              ))}
            </Collapse>
          </List>
        </Collapse>
      </List>
    </>
  );
};

export default MenuMain;
