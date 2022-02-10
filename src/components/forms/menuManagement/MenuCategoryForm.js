import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { db } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import ControlledSelect from "components/mui/ControlledSelect";
import ControlledInput from "components/mui/ControlledInput";
import DialogFormTemplate from "templates/dialogForm/DialogFormTemplate";

let schema = yup.object().shape({
  order: yup
    .number("Order must be a number")
    .positive("Order must be a positive number")
    .integer("Order must be an integer")
    .typeError("Order must be a number")
    .required("Order is a required field"),
  title: yup.string().trim().required("Title is a required field"),
  category: yup.string().trim().required("Category is a required field"),
});

const MenuCategoryForm = ({ save, setShowForm, editValues, menuMainKey, menuCategoryKey, isCategory }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      order: editValues?.order || 0,
      title: editValues?.title || "",
      category: editValues?.link || "",
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    const { id, order, title, category } = data;
    const key = category;
    let link = "";
    if (isCategory) link = `/products/${menuMainKey}/${category}`;
    else link = `/products/${menuMainKey}/${menuCategoryKey}?podcategory=${category}`;
    save({ id, order, title, link, key });
    setShowForm(false);
  };

  const [selectList, setSelectList] = useState([]);

  useEffect(() => {
    (async () => {
      const catPodcatRelations = (await getDoc(doc(db, "relations", "categoryPodcategory"))).data();
      if (isCategory) setSelectList(Object.keys(catPodcatRelations));
      else setSelectList(Object.keys(catPodcatRelations?.[menuCategoryKey]?.podcategories));
    })();
  }, []);

  return (
    <DialogFormTemplate
      maxWidth="lg"
      title={isCategory ? "Manage category" : "Manage podcategory"}
      onClose={() => setShowForm(false)}
      submit={handleSubmit(onSubmit)}
    >
      <DialogContent sx={{ display: "flex", justifyContent: "space-around" }}>
        <ControlledInput control={control} formName="order" label="Order" type="number" />
        <ControlledInput control={control} formName="title" label="Title" />
        {Object.keys(editValues).length === 0 && <ControlledSelect control={control} formName="category" itemsArray={selectList} />}
      </DialogContent>
    </DialogFormTemplate>
  );
};

export default MenuCategoryForm;
