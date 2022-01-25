import MenuMain from "components/menuLinks/MenuMain";
import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form";
import MenuForm from "components/menuLinks/MenuForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const MenuManagement = () => {
  const { control, handleSubmit } = useForm();
  const { fields: menusFields, append: menusAppend, replace: menusReplace } = useFieldArray({ control, name: "menus" });
  const submitAllMenus = () => {
    handleSubmit(onSubmit)();
  };
  const onSubmit = (data) => {
    const { menus } = data;
    /* tests */
    // setDoc(doc(db, "menus", "main"), {
    // setDoc(doc(db, "cities", "temp"), {
    setDoc(doc(db, "cities", "LA"), {
      ...menus,
    });
  };

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const menuMainsArray = [];
      /* tests */
      // const docRef = await doc(db, "cities", "LAaaaa");
      const docRef = await doc(db, "cities", "LA");
      const docSnap = (await getDoc(docRef)).data();
      for (const property in docSnap) {
        menuMainsArray.push(docSnap[property]);
      }
      menusReplace(menuMainsArray);
    })();
  }, []);

  const deleteMenuMain = (id) => {
    const updatedArray = [...menusFields].filter((item) => item.id !== id);
    menusReplace(updatedArray);
    submitAllMenus();
  };
  const addMenuMain = (values) => {
    const { order, title, link } = values;
    const newMenusArray = [
      ...menusFields,
      {
        order,
        title,
        link,
        categories: [],
      },
    ];
    setShowForm(false);
    menusReplace(newMenusArray);
    submitAllMenus();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Menu management
      </Typography>
      <Button
        variant="contained"
        sx={{ my: 2 }}
        startIcon={<AddIcon />}
        onClick={(e) => {
          e.preventDefault();
          setShowForm(true);
        }}
      >
        Add menu
      </Button>
      <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(1, 1fr)" }}>
        {menusFields.map((item) => (
          <MenuMain
            key={item.id}
            menuMain={item}
            deleteMenuMain={deleteMenuMain}
            menusFields={menusFields}
            menusReplace={menusReplace}
            submitAllMenus={submitAllMenus}
          />
        ))}
      </Box>
      {showForm && <MenuForm save={addMenuMain} setShowForm={setShowForm} />}
    </Box>
  );
};

export default MenuManagement;
