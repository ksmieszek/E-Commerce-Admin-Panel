import { Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

const ControlledSelect = ({ control, formName, itemsArray, multiple = false }) => (
  <FormControl sx={{ width: 300 }}>
    <Controller
      name={formName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <InputLabel id={`${formName}-checkbox-label`} style={{ color: Boolean(error) && "#d32f2f" }} size="small">
            Choose {formName}
          </InputLabel>
          <Select
            {...field}
            multiple={multiple}
            labelId={`${formName}-checkbox-label`}
            label={`Choose ${formName}`}
            size="small"
            error={Boolean(error)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 233,
                  width: 250,
                },
              },
            }}
            renderValue={(selected) => (multiple ? selected.join(", ") : selected)}
          >
            {itemsArray.map((name) => (
              <MenuItem key={name} value={name}>
                {multiple ? (
                  <Checkbox checked={field.value.indexOf(name) > -1} size="small" />
                ) : (
                  <Checkbox checked={field.value === name} size="small" />
                )}
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>{error?.message}</FormHelperText>
        </>
      )}
    />
  </FormControl>
);

export default ControlledSelect;
