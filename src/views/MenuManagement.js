import MenuMain from "components/menuLinks/MenuMain";
import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc, deleteDoc, addDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form";
import MenuForm from "components/menuLinks/MenuForm";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Typography } from "@mui/material";

const MenuManagement = () => {
  const { control, handleSubmit } = useForm();
  const { fields: menusFields, append: menusAppend, replace: menusReplace } = useFieldArray({ control, name: "menus" });
  const submitAllMenus = () => {
    handleSubmit(onSubmit)();
  };
  const onSubmit = (data) => {
    console.log("allMenus", data.menus);
    if (data.menus.length === 0) return;
    const { menus } = data;
    // setDoc(doc(db, "menus", "main"), {
    // setDoc(doc(db, "cities", "temp"), {
    setDoc(doc(db, "cities", "LA"), {
      ...menus,
    });
  };

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const categories = [];
      // const docRef = await doc(db, "cities", "LAaaaa");
      const docRef = await doc(db, "cities", "LA");
      const docSnap = (await getDoc(docRef)).data();
      for (const property in docSnap) {
        categories.push(docSnap[property]);
      }
      menusReplace(categories);

      // const addTestMenu = doc(db, "menu", "test");
      // setDoc(cityRef, {
      //   link: "/products/men",
      //   order: 1,
      //   title: "Men",
      //   categories: [
      //     {
      //       order: 1,
      //       title: "Trousers",
      //       link: "/products/men/trousers",
      //       podcategories: [
      //         { link: "/products/men/trousers?podcategory=jeans", order: 1, title: "Jeans" },
      //         { link: "/products/men/trousers?podcategory=tracksuit", order: 2, title: "Tracksuit" },
      //       ],
      //     },
      //     { link: "/404", title: "T-shirts", order: 2 },
      //   ],
      // });
    })();
  }, []);

  const deleteMenuMain = (id) => {
    const arr = [...menusFields].filter((item) => item.id !== id);
    menusReplace(arr);
    submitAllMenus();
  };
  const addMenuMain = (values) => {
    const { order, title, link } = values;
    const arrcopy = [
      ...menusFields,
      {
        order,
        title,
        link,
        categories: [],
      },
    ];
    setShowForm(false);
    menusReplace(arrcopy);
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
        {menusFields.map((item, index) => (
          <MenuMain
            key={item.id}
            menuMain={item}
            deleteMenuMain={deleteMenuMain}
            menusFields={menusFields}
            menusAppend={menusAppend}
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

// link: "/products/men",
// order: 1,
// title: "Men",
// categories : [
//   {
//     order: 1,
//     title: "Trousers",
//     link: "/products/men/trousers",
//     podcategories: [
//       { link: "/products/men/trousers?podcategory=jeans", order: 1, title: "Jeans" },
//       { link: "/products/men/trousers?podcategory=tracksuit", order: 2, title: "Tracksuit" },
//     ],
//   },
//   { link: "/404", title: "T-shirts", order: 2 },
// ];
