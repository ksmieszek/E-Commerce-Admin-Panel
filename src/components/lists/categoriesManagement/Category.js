import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import CategoryFieldForm from "../../forms/categoriesManagement/CategoryFieldForm";
import { useEffect } from "react/cjs/react.development";
import { db } from "firebase";
import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledExpand from "components/mui/StyledExpand";
import StyledListItemButton from "components/mui/StyledListItemButton";

const Category = ({ category, removeCategory }) => {
  const { control } = useForm();
  const { fields, append, replace } = useFieldArray({ control, name: "categoryFields" });

  useEffect(() => {
    for (const [key, value] of Object.entries(category.value)) {
      append({ key, value });
    }
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editValues, setEditValues] = useState(undefined);
  const [listCollapsed, setListCollapsed] = useState(false);

  const action = (values) => {
    if (values.id) editField(values);
    else addField(values);
  };

  const addField = async (values) => {
    const { key, value } = values;
    const docRef = doc(db, "categories", category.key);
    setDoc(docRef, { [key]: value }, { merge: true });
    append({ key, value });
    setEditValues(undefined);
  };
  const editField = async (values) => {
    const { id, key, value } = values;
    const fieldsArray = [...fields];
    const fieldIndex = fieldsArray.findIndex((item) => item.id === id);
    const docRef = doc(db, "categories", category.key);
    //remove old field in case of changed key
    await updateDoc(docRef, {
      [fieldsArray[fieldIndex].key]: deleteField(),
    });
    //add new field
    await updateDoc(docRef, {
      [key]: value,
    });
    fieldsArray[fieldIndex].key = key;
    fieldsArray[fieldIndex].value = value;
    replace(fieldsArray);
    setEditValues(undefined);
  };
  const removeField = (e, fieldId) => {
    e.stopPropagation();
    const fieldsArray = [...fields];
    const fieldIndex = fieldsArray.findIndex((item) => item.id === fieldId);
    const docRef = doc(db, "categories", category.key);
    updateDoc(docRef, {
      [fieldsArray[fieldIndex].key]: deleteField(),
    });
    fieldsArray.splice(fieldIndex, 1);
    replace(fieldsArray);
  };

  const addAction = (e) => {
    e.stopPropagation();
    setEditValues({});
    setShowForm(true);
  };
  const editAction = (e, item) => {
    e.stopPropagation();
    setEditValues({
      id: item.id,
      key: item.key,
      value: item.value,
    });
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
          <ListItemText primary={category.key} />
          <AddIcon sx={{ ml: 1 }} fontSize="medium" onClick={(e) => addAction(e)} />
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => removeCategory(category)} />
          {fields.length > 0 && <StyledExpand listCollapsed={listCollapsed} />}
        </StyledListItemButton>
        {fields.length > 0 && (
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <Collapse in={listCollapsed} timeout="auto" unmountOnExit sx={{ mb: 1 }}>
              {fields.map((item) => (
                <StyledListItemButton key={item.id}>
                  <ListItemText primary={`${item.key}: ${item.value}`} />
                  <DeleteIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => removeField(e, item.id)} />
                  <EditIcon fontSize="small" sx={{ ml: 1 }} onClick={(e) => editAction(e, item)} />
                </StyledListItemButton>
              ))}
            </Collapse>
          </List>
        )}
      </List>
      {showForm && <CategoryFieldForm save={action} setShowForm={setShowForm} editValues={editValues} />}
    </>
  );
};

export default Category;
