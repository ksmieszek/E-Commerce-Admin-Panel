import { useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form";
import MenuMain from "components/lists/menuManagement/MenuMain";
import MenuMainForm from "components/forms/menuManagement/MenuMainForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useDialog } from "hooks/useDialog";

const MenuManagement = () => {
  const { control, handleSubmit } = useForm();
  const { fields: menusFields, replace: menusReplace } = useFieldArray({ control, name: "menus" });
  const onSubmit = (data) => {
    const { menus } = data;
    setDoc(doc(db, "menus", "main"), {
      ...menus,
    });
  };
  const submitAllMenus = () => {
    handleSubmit(onSubmit)();
  };

  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    (async () => {
      const menuMainsArray = [];
      const docRef = await doc(db, "menus", "main");
      const docSnap = (await getDoc(docRef)).data();
      for (const property in docSnap) {
        menuMainsArray.push(docSnap[property]);
      }
      menusReplace(menuMainsArray);
    })();
  }, []);

  const addMenuMain = () => {
    const addMenuMain = (values) => {
      const { order, title, link, key } = values;
      const newMenusArray = [
        ...menusFields,
        {
          order,
          title,
          link,
          key,
          categories: [],
        },
      ];
      menusReplace(newMenusArray);
      submitAllMenus();
    };
    setDialogContent(<MenuMainForm action={addMenuMain} editValues={{}} />);
    setDialogSize("lg");
    setDialogTitle("Manage main category");
    openDialog();
  };

  const deleteMenuMain = (id) => {
    const updatedArray = [...menusFields].filter((item) => item.id !== id);
    menusReplace(updatedArray);
    submitAllMenus();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Main menu management
      </Typography>
      <Button variant="contained" sx={{ my: 2 }} startIcon={<AddIcon />} onClick={addMenuMain}>
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
    </Box>
  );
};

export default MenuManagement;
