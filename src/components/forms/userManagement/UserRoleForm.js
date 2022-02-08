import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

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

export default UserRoleForm;
