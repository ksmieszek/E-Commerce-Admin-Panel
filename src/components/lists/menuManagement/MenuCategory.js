import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import MenuForm from "../../forms/menuManagement/MenuForm";
import MenuPodcategory from "./MenuPodcategory";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";

const MenuCategory = ({ category, categoriesFields, categoriesReplace, deleteMenuCategory, submitChanges }) => {
  const { control } = useForm();
  const { fields: podcategoriesFields, replace: podcategoriesReplace } = useFieldArray({ control, name: "podcategories" });

  useEffect(() => {
    const podcategoriesArray = [];
    category.podcategories?.forEach((item) => {
      podcategoriesArray.push({ title: item.title, link: item.link, order: item.order });
    });
    podcategoriesReplace(podcategoriesArray);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editItemValues, setEditItemValues] = useState(undefined);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [subListCollapsed, setSubListCollapsed] = useState(false);

  const action = (values) => {
    if (values.id) editItem(values);
    else addPodcategory(values);
  };

  const deleteItem = () => {
    const updatedArray = [...categoriesFields].filter((item) => item.id !== category.id && item);
    deleteMenuCategory(updatedArray);
  };
  const editItem = (values) => {
    const updatedArray = [...categoriesFields].map((item) => {
      if (item.id === category.id) {
        item.order = values.order;
        item.title = values.title;
        item.link = values.link;
      }
      return item;
    });
    categoriesReplace(updatedArray);
    submitChanges();
  };

  const deletePodcategory = (newPodcategoriesArray) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };
  const editPodcategory = (newPodcategoriesArray) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };
  const addPodcategory = (values) => {
    const categoriesArrayCopy = [...categoriesFields];
    const categoryIndex = categoriesFields.findIndex((item) => item.id === category.id);
    const { order, title, link } = values;
    const newPodcategoriesArray = [
      ...podcategoriesFields,
      {
        order,
        title,
        link,
      },
    ];
    categoriesArrayCopy[categoryIndex].podcategories = newPodcategoriesArray;
    categoriesReplace(categoriesArrayCopy);
    submitChanges();
  };

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
    setEditItemValues({});
    setShowForm(true);
  };

  return (
    <>
      <StyledListItemButton onClick={() => setListCollapsed(!listCollapsed)}>
        <ListItemText primary={category.title} />
        <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => deleteAction(e)} />
        <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e)} />
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
          <AddIcon fontSize="medium" sx={{ ml: 1 }} onClick={(e) => addAction(e)} />
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
