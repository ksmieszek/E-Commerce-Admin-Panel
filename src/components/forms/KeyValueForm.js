import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogFormTemplate from "templates/dialogForm/DialogFormTemplate";

let schema = yup.object().shape({
  key: yup.string().trim().required("Key is a required field"),
  value: yup.string().trim().required("Name is a required field"),
});

const KeyValueForm = ({ save, setShowForm, editValues, title }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      key: editValues?.key || "",
      value: editValues?.value || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    save(data);
    setShowForm(false);
  };

  return (
    <DialogFormTemplate maxWidth="sm" title={title} onClose={() => setShowForm(false)} submit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ display: "flex", justifyContent: "space-around" }}>
        <Controller
          name="key"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={Boolean(error)}
              helperText={error?.message}
              label="Key"
              id="standard-error-helper-text"
              variant="standard"
              sx={{ width: "200px" }}
            />
          )}
        />
        <Controller
          name="value"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={Boolean(error)}
              helperText={error?.message}
              label="Name"
              id="standard-error-helper-text"
              variant="standard"
              sx={{ width: "200px" }}
            />
          )}
        />
      </DialogContent>
    </DialogFormTemplate>
  );
};

export default KeyValueForm;
