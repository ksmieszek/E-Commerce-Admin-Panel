import Category from "components/categories/Category";
import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form";
import CategoryNameForm from "components/categories/CategoryNameForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const Categories = () => {
  const { control } = useForm();
  const { fields, append, replace } = useFieldArray({ control, name: "categories" });

  useEffect(() => {
    (async () => {
      const categories = [];
      const querySnapshot = await getDocs(collection(db, "categories"));
      querySnapshot.forEach((doc) => categories.push({ key: doc.id, value: doc.data() }));
      replace(categories);
    })();
  }, []);

  const [showForm, setShowForm] = useState(false);

  const addItem = (name) => {
    setDoc(doc(db, "categories", name), {});
    append({ key: name, value: {} });
  };
  const removeItem = (category) => {
    const docRef = doc(db, "categories", category.key);
    deleteDoc(docRef);
    const categoriesFields = [...fields.filter((item) => item.id !== category.id)];
    replace(categoriesFields);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Categories management
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
        Add category
      </Button>
      <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, 1fr)" }}>
        {fields.map((item) => (
          <Category key={item.id} category={item} removeCategory={removeItem} />
        ))}
      </Box>
      {showForm && <CategoryNameForm save={addItem} setShowForm={setShowForm} />}
    </Box>
  );
};

export default Categories;
