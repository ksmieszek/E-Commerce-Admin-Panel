import styled from "styled-components";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import MenuForm from "./MenuForm";
import MenuPodcategory from "./MenuPodcategory";
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
  background: lightgray;
  padding: 20px;
  margin: 20px;
`;

const MenuCategory = ({ category, categoriesFields, categoriesAppend, categoriesReplace, submitChanges }) => {
  const { control } = useForm();
  const {
    fields: podcategoriesFields,
    append: podcategoriesAppend,
    replace: podcategoriesReplace,
  } = useFieldArray({ control, name: "podcategories" });

  //stworz liste podkategorii
  useEffect(() => {
    // console.log("MenuCategory ", category);
    if (category.podcategories?.length) {
      const arr = [];
      category.podcategories.forEach((item) => {
        // console.log("MenuCategoryMenuCategoryMenuCategory", item);
        arr.push({ title: item.title, link: item.link, order: item.order });
      });
      podcategoriesReplace(arr);
    }
    return podcategoriesReplace;
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);

  const action = (values) => {
    if (values.id) editItem(values);
    else addPodcategory(values);
  };

  const deleteItem = () => {
    const changedArr = [...categoriesFields].filter((item) => item.id !== category.id && item);
    categoriesReplace(changedArr);
    submitChanges();
  };
  const editItem = (values) => {
    const changedArr = [...categoriesFields].map((item) => {
      if (item.id === category.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
        return item;
      }
      return item;
    });
    categoriesReplace(changedArr);
    submitChanges();
  };

  //PODCATEGORY
  const deletePodcategory = (nowatablica) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = nowatablica;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };
  const editPodcategory = (nowatablica) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = nowatablica;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };
  const addPodcategory = (values) => {
    const categoriesArrayCopy = [...categoriesFields]; //Torusers,Tshirts
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    const { order, title, link } = values;
    const podcategoriesArrayCopy = [
      ...podcategoriesFields,
      {
        order,
        title,
        link,
      },
    ];
    categoriesArrayCopy[categoryIndex].podcategories = podcategoriesArrayCopy;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };

  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);
  const deleteAction = (e) => {
    e.stopPropagation();
    deleteItem();
  };
  const editAction = (e) => {
    e.stopPropagation();
    setEditItemValues({
      id: category.id,
      order: category.order,
      title: category.title,
      link: category.link,
    });
    setShowForm(true);
  };
  const addAction = (e) => {
    e.stopPropagation();
    setShowForm(true);
  };

  return (
    <>
      <ListItemButton
        onClick={() => setListCollapsed(!listCollapsed)}
        sx={{
          pt: `2px`,
          pb: `2px`,
          "&:hover": {
            color: "black",
            backgroundColor: "#ddd",
          },
        }}
      >
        <ListItemText primary={category.title} />
        <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteAction(e)} />
        <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e)} />
        {listCollapsed ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />}
      </ListItemButton>

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
          <ListItemText primary={`podcategories`} />
          <AddIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => addAction(e)} />
          {podcategoriesFields.length > 0 && (subListCollapsed ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />)}
        </ListItemButton>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <Collapse in={subListCollapsed} timeout="auto" unmountOnExit>
            {podcategoriesFields.length > 0 &&
              podcategoriesFields.map((item, index) => (
                <MenuPodcategory
                  key={item.id}
                  podcategory={podcategoriesFields[index]}
                  podcategoriesFields={podcategoriesFields}
                  deletePodcategory={deletePodcategory}
                  editPodcategory={editPodcategory}
                />
              ))}
          </Collapse>
        </List>
      </Collapse>

      {showForm && <MenuForm save={action} setShowForm={setShowForm} editValues={editItemValues} />}
    </>
  );
};

export default MenuCategory;
