import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import MenuSearchType from "./MenuSearchType";
import KeyValueForm from "components/forms/KeyValueForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MenuSearchTypes = () => {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const relations = (await getDoc(doc(db, "relations", "categoryPodcategory"))).data();
      const list = [];
      for (const [key, value] of Object.entries(relations)) list.push({ key: key, value: value });
      setFields(list);
    })();
  }, []);

  const addItem = async (values) => {
    const { key, value } = values;
    //check if relation key already exists
    if (fields.find((item) => item.key === key) !== undefined) return;
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

  const deleteItem = (index) => {
    const list = [...fields];
    list.splice(index, 1);
    setFields(list);
  };

  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 400 }}>
        Menu, search - relations
      </Typography>
      <Button
        variant="contained"
        sx={{ my: 2 }}
        startIcon={<AddIcon />}
        onClick={(e) => {
          e.stopPropagation();
          setShowForm(true);
        }}
      >
        Add relation
      </Button>
      <Box>
        {fields.map((item, index) => (
          <MenuSearchType key={item.key} relation={item.value} relationKey={item.key} indexInList={index} deleteRelation={deleteItem} />
        ))}
      </Box>
      {showForm && <KeyValueForm save={addItem} setShowForm={setShowForm} editValues={{}} title="Add relation" />}
    </Box>
  );
};

export default MenuSearchTypes;
