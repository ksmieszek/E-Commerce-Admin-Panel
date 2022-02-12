import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import ControlledInput from "components/mui/ControlledInput";
import ControlledSelect from "components/mui/ControlledSelect";
import DialogFormTemplate from "templates/dialog/DialogFormTemplate";

let schema = yup.object().shape({
  order: yup
    .number("Order must be a number")
    .positive("Order must be a positive number")
    .integer("Order must be an integer")
    .typeError("Order must be a number")
    .required("Order is a required field"),
  title: yup.string().trim().required("Title is a required field"),
  collection: yup.string().trim().required("Collection is a required field"),
});

const MenuMainForm = ({ action, editValues = {} }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      order: editValues?.order || "",
      title: editValues?.title || "",
      collection: editValues?.link || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { id, order, title, collection } = data;
    const key = collection;
    const path = `/products/${collection}`;
    action({ id, order, title, link: path, key });
  };

  const [collectionArray, setCollectionArray] = useState([]);
  useEffect(() => {
    (async () => {
      const data = (await getDoc(doc(db, "types", "collection"))).data();
      setCollectionArray(data.array);
    })();
  }, []);

  return (
    <DialogFormTemplate submit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ display: "flex", justifyContent: "space-around" }}>
        <ControlledInput control={control} formName="order" label="Order" type="number" />
        <ControlledInput control={control} formName="title" label="Title" />
        {Object?.keys(editValues)?.length === 0 && <ControlledSelect control={control} formName="collection" itemsArray={collectionArray} />}
      </DialogContent>
    </DialogFormTemplate>
  );
};

export default MenuMainForm;
