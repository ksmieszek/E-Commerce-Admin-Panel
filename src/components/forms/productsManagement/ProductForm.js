import { useEffect, useState } from "react";
import { db } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const ControlledTooltip = ({ textToCopy, children }) => {
  const [title, setTitle] = useState("Click to copy");
  const copied = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
    setTitle("Copied");
    setTimeout(() => {
      setTitle("Click to copy");
    }, 1500);
  };
  return (
    <Tooltip placement="top" leaveDelay={500} title={title} onClick={(e) => copied(e)}>
      {children}
    </Tooltip>
  );
};

const ControlledMultipleSelect = ({ control, formName, itemsArray }) => (
  <FormControl sx={{ width: 300 }}>
    <Controller
      name={formName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <InputLabel id={`${formName}-multiple-checkbox-label`} style={{ color: Boolean(error) && "#d32f2f" }} size="small">
            Choose {formName}
          </InputLabel>
          <Select
            {...field}
            multiple
            labelId={`${formName}-multiple-checkbox-label`}
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
            renderValue={(selected) => selected.join(", ")}
          >
            {itemsArray.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={field.value.indexOf(name) > -1} size="small" />
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

let schema = yup.object().shape({
  frontImage: yup.string().url("Front image has to be URL address").trim().required("Front image name is a required field"),
  backImage: yup.string().url("Back image has to be URL address").trim().required("Back image name is a required field"),
  images: yup.array().of(
    yup.object({
      src: yup.string().url(),
    })
  ),
  name: yup.string().trim().required("Product name is a required field"),
  price: yup
    .number("Price must be a number")
    .positive("Price must be a positive number")
    .typeError("Price must be a number")
    .required("Price is a required field"),
  sex: yup.array().min(1, "Sex list must have at least one item").of(yup.string().trim()),
  category: yup.array().min(1, "Category list must have at least one item").of(yup.string().trim()),
  podcategory: yup.array().min(1, "Podcategory list must have at least one item").of(yup.string().trim()),
  sizes: yup.array().min(1, "Size list must have at least one item").of(yup.string().trim()),
  colors: yup.array().min(1, "Color list must have at least one item").of(yup.string().trim()),
});

const ProductForm = ({ setShowForm, editValues, save }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: editValues?.id || undefined,
      frontImage: editValues?.frontImage || "",
      backImage: editValues?.backImage || "",
      images: editValues?.images?.map((item) => ({ src: item })) || [],
      name: editValues?.name || "",
      price: editValues?.price || "",
      sex: editValues?.sex || [],
      category: editValues?.category || [],
      podcategory: editValues?.podcategory || [],
      sizes: editValues?.sizes || [],
      colors: editValues?.colors || [],
    },
    resolver: yupResolver(schema),
  });
  const { fields: imagesFields, append: imagesAppend, remove: imagesRemove } = useFieldArray({ control, name: "images" });

  const onSubmit = async (data) => {
    const { id, name, price, frontImage, backImage, sex, sizes, colors, category, podcategory, images } = data;
    const getImages = images.map((item) => item.src);
    const categories = [...sex, ...category, ...podcategory, ...colors, ...sizes];
    save({ id, name, price, frontImage, backImage, sex, sizes, colors, category, podcategory, images: getImages, categories });
    setShowForm(false);
  };

  const [newImageUrl, SetNewImageUrl] = useState("");
  const [sexArray, setSexArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [podcategoryArray, setPodcategoryArray] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);

  useEffect(() => {
    fetchCategory("sex", setSexArray);
    fetchCategory("color", setColorArray);
    fetchCategory("category", setCategoryArray);
    fetchCategory("podcategory", setPodcategoryArray);
    fetchCategory("size", setSizeArray);
  }, []);

  const fetchCategory = async (categoryName, saveFunc) => {
    const docRef = doc(db, "categories", categoryName);
    const docSnap = (await getDoc(docRef)).data();
    saveFunc(Object.values(docSnap));
  };

  return (
    <Dialog
      open={true}
      fullWidth={false}
      maxWidth="lg"
      onClose={() => setShowForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ paddingY: "10px" }}>
        <DialogContent sx={{ maxWidth: "1000px", paddingX: "25px", paddingTop: "30px" }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "grid", gap: 5, gridTemplateColumns: "repeat(2, 1fr)" }}>
              <ControlledInput control={control} formName="name" label="Product name" />
              <ControlledInput control={control} formName="price" label="Price" type="number" />
              <ControlledMultipleSelect control={control} formName="sex" itemsArray={sexArray} />
              <ControlledMultipleSelect control={control} formName="category" itemsArray={categoryArray} />
              <ControlledMultipleSelect control={control} formName="podcategory" itemsArray={podcategoryArray} />
              <ControlledMultipleSelect control={control} formName="sizes" itemsArray={sizeArray} />
              <ControlledMultipleSelect control={control} formName="colors" itemsArray={colorArray} />
            </Box>
            <Box sx={{ display: "grid", gap: 5, gridTemplateColumns: "repeat(2, 1fr)", marginTop: "40px" }}>
              <ControlledInput control={control} formName="frontImage" label="Front image URL" wide />
              <ControlledInput control={control} formName="backImage" label="Back image URL" wide />
            </Box>
            <Box sx={{ marginTop: "40px" }}>
              <Stack direction="row">
                <TextField
                  label="New photo URL"
                  size="small"
                  sx={{ width: "300px" }}
                  value={newImageUrl}
                  onChange={(e) => SetNewImageUrl(e.target.value)}
                  error={Boolean(errors?.images)}
                  helperText={errors?.images?.length > 0 && "Every image has to be URL address"}
                />
                <Button
                  variant="contained"
                  sx={{ ml: 5, maxHeight: "40px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (newImageUrl === "") return;
                    imagesAppend({ src: newImageUrl });
                    SetNewImageUrl("");
                  }}
                >
                  add to product images
                </Button>
              </Stack>
              <Box component="div" sx={{ overflowY: "auto", maxHeight: "210px", maxWidth: "600px", mt: "20px" }}>
                {imagesFields.map((field, index) => (
                  <Box key={field.id}>
                    <Stack sx={{ m: 2 }}>
                      <Stack direction="row" sx={{ my: 1 }}>
                        <Box component="span" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                          {field.src}
                        </Box>
                        <ControlledTooltip textToCopy={field.src}>
                          <Button size="small" sx={{ ml: 3 }}>
                            Copy
                          </Button>
                        </ControlledTooltip>
                        <Button
                          variant="contained"
                          startIcon={<DeleteIcon />}
                          color="error"
                          size="small"
                          sx={{ ml: 3 }}
                          onClick={(e) => {
                            e.preventDefault();
                            imagesRemove(index);
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
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

export default ProductForm;
