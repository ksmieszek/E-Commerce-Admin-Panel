import { useState } from "react";
import { db } from "firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import StyledList from "./StyledList";
import TitleForm from "components/forms/TitleForm";
import { useDialog } from "hooks/useDialog";

const ProductType = ({ category }) => {
  const [fields, setFields] = useState(category.value.array);
  const [showForm, setShowForm] = useState(false);
  const { setOpenDialog, setDialogAction } = useDialog();

  const addField = async (value) => {
    await updateDoc(doc(db, "types", category.key), {
      array: arrayUnion(value),
    });
    setFields([...fields, value]);
  };

  const removeField = (e, index) => {
    e.stopPropagation();
    setDialogAction(() => async () => {
      await updateDoc(doc(db, "types", category.key), {
        array: arrayRemove(fields[index]),
      });
      const fieldsArray = [...fields];
      fieldsArray.splice(index, 1);
      setFields(fieldsArray);
    });
    setOpenDialog(true);
  };

  const addAction = (e) => {
    e.stopPropagation();
    setShowForm(true);
  };

  return (
    <>
      <StyledList title={category.key} fields={fields} addAction={addAction} removeField={removeField} />
      {showForm && <TitleForm save={addField} setShowForm={setShowForm} />}
    </>
  );
};

export default ProductType;
