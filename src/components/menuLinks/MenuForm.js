import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

let schema = yup.object().shape({
  order: yup
    .number("Order must be a number")
    .positive("Order must be a positive number")
    .integer("Order must be an integer")
    .typeError("Order must be a number")
    .required("Order is a required field"),
  title: yup.string().trim().required("Title is a required field"),
  link: yup.string().trim().required("Link is a required field"),
});

const MenuForm = ({ save, setShowForm, editValues }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      order: editValues?.order || 0,
      title: editValues?.title || "",
      link: editValues?.link || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { id, order, title, link } = data;
    save({ id, order, title, link });
  };

  return (
    <Dialog
      open={true}
      fullWidth={true}
      maxWidth="md"
      onClose={() => setShowForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box component="form" noValidate autoComplete="off" sx={{ pt: 3 }}>
        <DialogContent sx={{ display: "flex", justifyContent: "space-around" }}>
          <Controller
            name="order"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error)}
                helperText={error?.message}
                type="number"
                label="Order"
                id="standard-error-helper-text"
                variant="standard"
                sx={{ width: "200px" }}
              />
            )}
          />
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error)}
                helperText={error?.message}
                label="Title"
                id="standard-error-helper-text"
                variant="standard"
                sx={{ width: "200px" }}
              />
            )}
          />
          <Controller
            name="link"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error)}
                helperText={error?.message}
                label="Link"
                id="standard-error-helper-text"
                variant="standard"
                sx={{ width: "200px" }}
              />
            )}
          />
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

export default MenuForm;
