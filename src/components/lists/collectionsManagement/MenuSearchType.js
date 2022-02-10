import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import KeyValueForm from "components/forms/KeyValueForm";
import TitleForm from "components/forms/TitleForm";
import StyledList from "./StyledList";
import { useDialog } from "hooks/useDialog";

const MenuSearchType = ({ relation, relationKey, indexInList, deleteRelation }) => {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editValues, setEditValues] = useState(undefined);
  const { setOpenDialog, setDialogAction } = useDialog();

  useEffect(() => {
    (async () => {
      const list = [];
      for (const [key, value] of Object.entries(relation.podcategories)) list.push({ key, value });
      setFields(list);
    })();
  }, []);

  const action = (values) => {
    if (Object.keys(editValues).length !== 0) editTitle(values);
    else addField(values);
  };

  const editTitle = async (title) => {
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
    relation.name = title;
  };

  const addField = async (values) => {
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
  const removeField = (e, fieldIndex) => {
    e.stopPropagation();
    setDialogAction(() => () => {
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
    });
    setOpenDialog(true);
  };

  const addAction = (e) => {
    e.stopPropagation();
    setEditValues({});
    setShowForm(true);
  };
  const editAction = (e) => {
    e.stopPropagation();
    setEditValues({
      title: relation.name,
    });
    setShowForm(true);
  };
  const deleteAction = (e) => {
    e.stopPropagation();
    setDialogAction(() => async () => {
      const docRef = doc(db, "relations", "categoryPodcategory");
      await updateDoc(docRef, {
        [relationKey]: deleteField(),
      });
      deleteRelation(indexInList);
    });
    setOpenDialog(true);
  };

  return (
    <>
      <StyledList
        title={`${relationKey}: ${relation.name}`}
        fields={fields}
        addAction={addAction}
        editAction={editAction}
        deleteAction={deleteAction}
        removeField={removeField}
      />
      {showForm ? (
        Object.keys(editValues).length !== 0 ? (
          <TitleForm save={action} setShowForm={setShowForm} editValues={editValues} title="Edit title" />
        ) : (
          <KeyValueForm save={action} setShowForm={setShowForm} editValues={editValues} title="Add relation field" />
        )
      ) : null}
    </>
  );
};

export default MenuSearchType;
