import styled from "styled-components";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import MenuCategory from "./MenuCategory";
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
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

const StyledWrapper = styled.div`
  background: grey;
  padding: 20px;
  margin: 30px;
`;

const MenuMain = ({ menuMain, deleteMenuMain, menusReplace, menusAppend, menusFields, submitAllMenus }) => {
  const { handleSubmit, control } = useForm();
  const { fields: categoriesFields, append: categoriesAppend, replace: categoriesReplace } = useFieldArray({ control, name: "categories" });
  const submitMenuMain = () => {
    handleSubmit(onSubmit)();
  };
  const onSubmit = (data) => {
    console.log("menuMain", data);
    //update menumain in collection
    const changedArr = [...menusFields].map((item) => {
      if (item.id === menuMain.id) {
        item.categories = categoriesFields;
        return item;
      }
      return item;
    });
    menusReplace(changedArr);
    submitAllMenus();
  };

  //dodaj kategorie
  useEffect(() => {
    if (menuMain === undefined) return;
    // console.log("MenuMain ", menuMain);
    const arr = [];
    menuMain.categories?.forEach(async (item) => {
      arr.push({ title: item.title, link: item.link, order: item.order, podcategories: item.podcategories || [] });
    });
    categoriesReplace(arr);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);

  const action = (values) => {
    if (values.id) editItem(values);
    else addMenuCategory(values);
  };

  const deleteItem = () => {
    deleteMenuMain(menuMain.id);
  };
  const editItem = (values) => {
    const changedArr = [...menusFields].map((item) => {
      if (item.id === menuMain.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
        return item;
      }
      return item;
    });
    setShowForm(false);
    menusReplace(changedArr);
    submitAllMenus();
  };

  const addMenuCategory = (values) => {
    const menusArrayCopy = [...menusFields];
    const menuMainIndex = menusFields.findIndex((item) => item.id === menuMain.id);
    const { order, title, link } = values;
    const categoriesArrayCopy = [
      ...categoriesFields,
      {
        order,
        title,
        link,
        podcategories: [],
      },
    ];
    menusArrayCopy[menuMainIndex].categories = categoriesArrayCopy;
    menusReplace(menusArrayCopy);
    submitAllMenus();
  };

  // const handleClick = (e) => {
  //   setListCollapsed(!listCollapsed);
  // };
  // const subhandleClick = () => {
  //   setSubListCollapsed(!subListCollapsed);
  // };

  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);
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
    setShowForm(true);
  };

  return (
    <>
      {/* <List sx={{ width: "100%", maxWidth: 360, bgcolor: "text.disabled", ml: 5, mb: 10 }} component="nav" aria-labelledby="nested-list-subheader"> */}
      <List
        sx={{
          width: "500px",
          maxWidth: 500,
          m: 5,
          border: 1,
          borderColor: "grey.200",
          bgcolor: "#fff",
          borderRadius: 3,
          pb: 0,
          pt: 0,
          overflow: "hidden",
          height: "min-content",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton
          onClick={() => setListCollapsed(!listCollapsed)}
          sx={{
            "&:hover": {
              color: "black",
              backgroundColor: "#ddd",
            },
          }}
        >
          <ListItemText primary={menuMain.title} />
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteAction(e)} />
          <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e)} />
          {listCollapsed ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />}
        </ListItemButton>

        <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ mb: 1 }}>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText>order: {menuMain.order}</ListItemText>
          </List>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText primary={`title: ${menuMain.title}`} />
            {/* <span sx={{ color: "warning.main" }}>title: </span> {menuMain.title} */}
          </List>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemText primary={`link: ${menuMain.link}`} />
            {/* <span sx={{ color: "#F00" }}>link: </span> {menuMain.link} */}
          </List>

          <ListItemButton
            onClick={() => setSubListCollapsed(!subListCollapsed)}
            component="div"
            disablePadding
            sx={{
              pl: 4,
              pt: `2px`,
              pb: `2px`,
              "&:hover": {
                color: "black",
                backgroundColor: "#ddd",
              },
            }}
          >
            <ListItemText primary={`categories`} />
            <AddIcon sx={{ ml: 1 }} fontSize="medium" onClick={(e) => addAction(e)} />
            {categoriesFields.length > 0 && (subListCollapsed ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />)}
          </ListItemButton>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <Collapse in={subListCollapsed} timeout="auto" unmountOnExit>
              {categoriesFields.map((item, index) => (
                <MenuCategory
                  key={item.id}
                  category={categoriesFields[index]}
                  categoriesFields={categoriesFields}
                  categoriesAppend={categoriesAppend}
                  categoriesReplace={categoriesReplace}
                  submitChanges={submitMenuMain}
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
