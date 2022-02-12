import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import KeyValueForm from "components/forms/KeyValueForm";
import TitleForm from "components/forms/TitleForm";
import StyledList from "./StyledList";
import { useDialog } from "hooks/useDialog";
import DeleteForm from "components/mui/DeleteForm";

const MenuSearchType = ({ relation, relationKey, indexInList, deleteRelation, editRelation }) => {
  const [fields, setFields] = useState([]);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    const list = [];
    for (const [key, value] of Object.entries(relation.podcategories)) list.push({ key, value });
    setFields(list);
  }, []);

  const editRelationAction = (e) => {
    e.stopPropagation();
    const action = (title) => {
      const docRef = doc(db, "relations", "categoryPodcategory");
      setDoc(
        docRef,
        {
          [relationKey]: {
            name: title,
          },
        },
        { merge: true }
      );
      editRelation(indexInList, title);
    };
    setDialogContent(
      <TitleForm
        action={action}
        editValues={{
          title: relation.name,
        }}
      />
    );
    setDialogSize("sm");
    setDialogTitle("Edit title");
    openDialog();
  };

  const deleteRelationAction = (e) => {
    e.stopPropagation();
    const action = async () => {
      const docRef = doc(db, "relations", "categoryPodcategory");
      await updateDoc(docRef, {
        [relationKey]: deleteField(),
      });
      deleteRelation(indexInList);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  const addField = (e) => {
    e.stopPropagation();
    const action = (values) => {
      const { key, value } = values;
      //check if podcategory already exists
      if (relation.podcategories?.[key] !== undefined) return;
      const docRef = doc(db, "relations", "categoryPodcategory");
      setDoc(
        docRef,
        {
          [relationKey]: {
            podcategories: {
              [key]: value,
            },
          },
        },
        { merge: true }
      );
      setFields([...fields, { key, value }]);
    };
    setDialogContent(<KeyValueForm action={action} editValues={{}} />);
    setDialogSize("sm");
    setDialogTitle("Add relation field");
    openDialog();
  };

  const removeField = (fieldIndex) => {
    const action = () => {
      const fieldsArray = [...fields];
      fieldsArray.splice(fieldIndex, 1);
      const podcategories = [...fieldsArray].reduce(
        (previousValue, currentValue) => Object.assign(previousValue, { [currentValue.key]: currentValue.value }),
        {}
      );
      const docRef = doc(db, "relations", "categoryPodcategory");
      updateDoc(docRef, {
        [relationKey]: {
          name: relation.name,
          podcategories,
        },
      });
      setFields(fieldsArray);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  return (
    <StyledList
      title={`${relationKey}: ${relation.name}`}
      fields={fields}
      addAction={addField}
      editAction={editRelationAction}
      deleteAction={deleteRelationAction}
      removeField={removeField}
    />
  );
};

export default MenuSearchType;
