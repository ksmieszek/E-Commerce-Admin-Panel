import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import MenuCategory from "./MenuCategory";
import MenuForm from "./MenuForm";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";

const MenuMain = ({ menuMain, deleteMenuMain, menusReplace, menusFields, submitAllMenus }) => {
  const { handleSubmit, control } = useForm();
  const { fields: categoriesFields, append: categoriesAppend, replace: categoriesReplace } = useFieldArray({ control, name: "categories" });
  const submitMenuMain = () => {
    handleSubmit(onSubmit)();
  };
  const onSubmit = () => {
    const updatedArray = [...menusFields].map((item) => {
      if (item.id === menuMain.id) {
        item.categories = categoriesFields;
        return item;
      }
      return item;
    });
    menusReplace(updatedArray);
    submitAllMenus();
  };

  useEffect(() => {
    const categoriesArray = [];
    menuMain.categories?.forEach(async (item) => {
      categoriesArray.push({ title: item.title, link: item.link, order: item.order, podcategories: item.podcategories || [] });
    });
    categoriesReplace(categoriesArray);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);

  const action = (values) => {
    if (values.id) editItem(values);
    else addMenuCategory(values);
  };

  const deleteItem = () => {
    deleteMenuMain(menuMain.id);
  };
  const editItem = (values) => {
    const updatedArray = [...menusFields].map((item) => {
      if (item.id === menuMain.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
      }
      return item;
    });
    setShowForm(false);
    menusReplace(updatedArray);
    submitAllMenus();
  };

  const addMenuCategory = (values) => {
    const menusArrayCopy = [...menusFields];
    const menuMainIndex = menusFields.findIndex((item) => item.id === menuMain.id);
    const { order, title, link } = values;
    const newCategoriesArray = [
      ...categoriesFields,
      {
        order,
        title,
        link,
        podcategories: [],
      },
    ];
    menusArrayCopy[menuMainIndex].categories = newCategoriesArray;
    menusReplace(menusArrayCopy);
    submitAllMenus();
  };
  const deleteMenuCategory = (newCategoriesArray) => {
    const menusArrayCopy = [...menusFields];
    const menuMainIndex = menusFields.findIndex((item) => item.id === menuMain.id);
    menusArrayCopy[menuMainIndex].categories = newCategoriesArray;
    menusReplace(menusArrayCopy);
    submitAllMenus();
  };

  const deleteAction = (e) => {
    e.stopPropagation();
    deleteItem();
  };
  const editAction = (e) => {
    e.stopPropagation();
    setEditItemValues({
      id: menuMain.id,
      order: menuMain.order,
      title: menuMain.title,
      link: menuMain.link,
    });
    setShowForm(true);
  };
  const addAction = (e) => {
    e.stopPropagation();
    setEditItemValues({});
    setShowForm(true);
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
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteAction(e)} />
          <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e)} />
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
            <AddIcon sx={{ ml: 1 }} fontSize="medium" onClick={(e) => addAction(e)} />
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
                />
              ))}
            </Collapse>
          </List>
        </Collapse>
      </List>
      {showForm && <MenuForm save={action} setShowForm={setShowForm} editValues={editItemValues} />}
    </>
  );
};

export default MenuMain;
