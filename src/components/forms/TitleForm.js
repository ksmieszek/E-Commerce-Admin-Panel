import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogFormTemplate from "templates/dialog/DialogFormTemplate";

let schema = yup.object().shape({
  title: yup.string().trim().required("Title is a required field"),
});

const TitleForm = ({ action, editValues }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      title: editValues?.title || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    action(data.title);
  };

  return (
    <DialogFormTemplate submit={handleSubmit(onSubmit)}>
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
    </DialogFormTemplate>
  );
};

export default TitleForm;
