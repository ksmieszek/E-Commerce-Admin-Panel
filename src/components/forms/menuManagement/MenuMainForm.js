import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import ControlledInput from "components/mui/ControlledInput";
import ControlledSelect from "components/mui/ControlledSelect";

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

const MenuMainForm = ({ save, setShowForm, editValues = {} }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      order: editValues?.order || 0,
      title: editValues?.title || "",
      collection: editValues?.link || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { id, order, title, collection } = data;
    const key = collection;
    const path = `/products/${collection}`;
    save({ id, order, title, link: path, key });
  };

  const [collectionArray, setCollectionArray] = useState([]);
  useEffect(() => {
    (async () => {
      const data = (await getDoc(doc(db, "types", "collection"))).data();
      setCollectionArray(data.array);
    })();
  }, []);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      maxWidth="lg"
      onClose={() => setShowForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box component="form" noValidate autoComplete="off" sx={{ pt: 3 }}>
        <DialogContent sx={{ display: "flex", justifyContent: "space-around" }}>
          <ControlledInput control={control} formName="order" label="Order" type="number" />
          <ControlledInput control={control} formName="title" label="Title" />
          {Object?.keys(editValues)?.length === 0 && <ControlledSelect control={control} formName="collection" itemsArray={collectionArray} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3 }}>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSubmit(onSubmit)()}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MenuMainForm;
