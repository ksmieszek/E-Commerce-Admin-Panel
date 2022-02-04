import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const ControlledInput = ({ control, formName, label, type = "text", wide }) => (
  <Controller
    name={formName}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        error={Boolean(error)}
        helperText={error?.message}
        label={label}
        sx={{ width: wide ? "400px" : "300px" }}
        type={type}
        size="small"
      />
    )}
  />
);

export default ControlledInput;
