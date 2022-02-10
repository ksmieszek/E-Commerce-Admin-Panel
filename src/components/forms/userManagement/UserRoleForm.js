import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import DialogFormTemplate from "templates/dialogForm/DialogFormTemplate";

let schema = yup.object().shape({
  isAdmin: yup.string().trim().required("Role must be defined"),
});

const UserRoleForm = ({ save, setShowForm, editValues }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      id: editValues?.id || undefined,
      isAdmin: editValues?.isAdmin ? "true" : "false" || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { isAdmin, id } = data;
    save({ id, admin: isAdmin });
    setShowForm(false);
  };

  return (
    <DialogFormTemplate maxWidth="sm" title="Change user role" onClose={() => setShowForm(false)} submit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ display: "flex", justifyContent: "left" }}>
        <FormControl sx={{ width: 300 }}>
          <Controller
            name="isAdmin"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <InputLabel id={`isAdmin-checkbox-label`} style={{ color: Boolean(error) && "#d32f2f" }} size="small">
                  Is admin?
                </InputLabel>
                <Select
                  {...field}
                  labelId={`isAdmin-checkbox-label`}
                  label="Is admin?"
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
                  renderValue={(selected) => selected}
                >
                  {["true", "false"].map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={field.value === name} size="small" />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{error?.message}</FormHelperText>
              </>
            )}
          />
        </FormControl>
      </DialogContent>
    </DialogFormTemplate>
  );
};

export default UserRoleForm;
