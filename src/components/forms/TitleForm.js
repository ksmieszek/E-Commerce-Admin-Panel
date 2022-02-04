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
  title: yup.string().trim().required("Title is a required field"),
});

const TitleForm = ({ save, setShowForm, editValues }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      title: editValues?.title || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    save(data.title);
    setShowForm(false);
  };

  return (
    <Dialog
      open={true}
      fullWidth={true}
      maxWidth="sm"
      onClose={() => setShowForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box component="form" noValidate autoComplete="off" sx={{ pt: 3 }}>
        <DialogContent sx={{ display: "flex", justifyContent: "left" }}>
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
                sx={{ ml: "30px", width: "300px" }}
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

export default TitleForm;
