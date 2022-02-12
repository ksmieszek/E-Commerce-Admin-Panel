import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import MenuSearchType from "./MenuSearchType";
import KeyValueForm from "components/forms/KeyValueForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "hooks/useSnackbar";
import { useDialog } from "hooks/useDialog";

const MenuSearchTypes = () => {
  const [fields, setFields] = useState([]);
  const { setSnackbarState } = useSnackbar();
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    (async () => {
      const relations = (await getDoc(doc(db, "relations", "categoryPodcategory"))).data();
      const list = [];
      for (const [key, value] of Object.entries(relations)) list.push({ key: key, value: value });
      setFields(list);
    })();
  }, []);

  const addRelation = () => {
    const action = (values) => {
      const { key, value } = values;
      //check if relation key already exists
      if (fields.find((item) => item.key === key) !== undefined) {
        setSnackbarState({
          open: true,
          severity: "warning",
          message: "It already exists",
        });
        return;
      }
      const docRef = doc(db, "relations", "categoryPodcategory");
      const newRelation = {
        [key]: {
          name: value,
          podcategories: {},
        },
      };
      setDoc(
        docRef,
        {
          ...newRelation,
        },
        { merge: true }
      );
      const list = [...fields, { key: key, value: newRelation[key] }];
      setFields(list);
    };
    setDialogContent(<KeyValueForm action={action} editValues={{}} />);
    setDialogSize("sm");
    setDialogTitle("Add relation");
    openDialog();
  };

  const editRelation = (index, title) => {
    const list = [...fields];
    list[index].value.name = title;
    setFields(list);
  };

  const deleteRelation = (index) => {
    const list = [...fields];
    list.splice(index, 1);
    setFields(list);
  };

  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 400 }}>
        Menu, search - relations
      </Typography>
      <Button variant="contained" sx={{ my: 2 }} startIcon={<AddIcon />} onClick={addRelation}>
        Add relation
      </Button>
      <Box>
        {fields.map((item, index) => (
          <MenuSearchType
            key={item.key}
            relation={item.value}
            relationKey={item.key}
            indexInList={index}
            editRelation={editRelation}
            deleteRelation={deleteRelation}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MenuSearchTypes;
