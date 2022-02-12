import { useState } from "react";
import { db } from "firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import StyledList from "./StyledList";
import TitleForm from "components/forms/TitleForm";
import { useDialog } from "hooks/useDialog";
import { useSnackbar } from "hooks/useSnackbar";
import DeleteForm from "components/mui/DeleteForm";

const ProductType = ({ category }) => {
  const [fields, setFields] = useState(category.value.array);
  const { setSnackbarState } = useSnackbar();
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  const addField = (e) => {
    e.stopPropagation();
    const action = async (value) => {
      //check if field already exists
      if (!fields.includes(value)) {
        await updateDoc(doc(db, "types", category.key), {
          array: arrayUnion(value),
        });
        setFields([...fields, value]);
      } else {
        setSnackbarState({
          open: true,
          severity: "warning",
          message: "It already exists",
        });
      }
    };
    setDialogContent(<TitleForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Add type");
    openDialog();
  };

  const removeField = (index) => {
    const action = async () => {
      await updateDoc(doc(db, "types", category.key), {
        array: arrayRemove(fields[index]),
      });
      const fieldsArray = [...fields];
      fieldsArray.splice(index, 1);
      setFields(fieldsArray);
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  return <StyledList title={category.key} fields={fields} addAction={addField} removeField={removeField} />;
};

export default ProductType;
