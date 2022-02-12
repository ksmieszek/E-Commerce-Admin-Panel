import { useEffect, useState } from "react";
import { db } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ControlledSelect from "components/mui/ControlledSelect";
import ControlledInput from "components/mui/ControlledInput";
import StyledTooltip from "components/mui/StyledTooltip";
import PhotosForm from "components/forms/photosManagement/PhotosForm";
import { useDialog } from "hooks/useDialog";

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
  collection: yup.array().min(1, "Collection list must have at least one item").of(yup.string().trim()),
  category: yup.string().typeError("Category field is required").required("Category field is required"),
  podcategory: yup.array().min(1, "Podcategory list must have at least one item").of(yup.string().trim()),
  sizes: yup.array().min(1, "Size list must have at least one item").of(yup.string().trim()),
  colors: yup.array().min(1, "Color list must have at least one item").of(yup.string().trim()),
});

const ProductForm = ({ editValues, action }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      id: editValues?.id || undefined,
      frontImage: editValues?.frontImage || "",
      backImage: editValues?.backImage || "",
      images: editValues?.images?.map((item) => ({ src: item })) || [],
      name: editValues?.name || "",
      price: editValues?.price || "",
      collection: editValues?.collection || [],
      category: (editValues?.category && editValues?.category[0]) || [],
      podcategory: editValues?.podcategory || [],
      sizes: editValues?.sizes || [],
      colors: editValues?.colors || [],
    },
    resolver: yupResolver(schema),
  });
  const { fields: imagesFields, append: imagesAppend, remove: imagesRemove } = useFieldArray({ control, name: "images" });
  const watchCategory = watch("category");

  const onSubmit = (data) => {
    const { id, name, price, frontImage, backImage, collection, sizes, colors, category, podcategory, images } = data;
    const getImages = images.map((item) => item.src);
    const categories = [...collection, category, ...podcategory, ...colors, ...sizes];
    action({ id, name, price, frontImage, backImage, collection, sizes, colors, category, podcategory, images: getImages, categories });
    closeDialog();
  };

  const [newImageUrl, SetNewImageUrl] = useState("");
  const [collectionArray, setCollectionArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);
  const [catPodcatRelations, setCatPodcatRelations] = useState(undefined);
  const [podcategoriesList, setPodcategoriesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [prevChosenCategory, setPrevChosenCategory] = useState([watchCategory]);
  const [showPhotosForm, setShowPhotosForm] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const { closeDialog } = useDialog();

  useEffect(() => {
    (async () => {
      const relations = (await getDoc(doc(db, "relations", "categoryPodcategory"))).data();
      setCatPodcatRelations(relations);
      setCategoriesList(Object.keys(relations));
    })();
  }, []);

  useEffect(() => {
    const chosenCategory = Array.isArray(watchCategory) ? watchCategory : [watchCategory];
    //dont genarate podcategories list if category is not chosen or relations object is undefined
    if (!chosenCategory[0] || catPodcatRelations === undefined) return;
    //generate podcategory list according to chosen category
    const podcategoriesOfCategory = catPodcatRelations[chosenCategory[0]]?.podcategories;
    setPodcategoriesList(Object.keys(podcategoriesOfCategory));
    //reset chosen podcategories if category has changed
    if (prevChosenCategory[0] !== chosenCategory[0]) {
      setValue("podcategory", []);
      setPrevChosenCategory(chosenCategory);
    }
  }, [watchCategory, catPodcatRelations]);

  useEffect(() => {
    fetchCollection("collection", setCollectionArray);
    fetchCollection("color", setColorArray);
    fetchCollection("size", setSizeArray);
  }, []);

  const fetchCollection = async (categoryName, saveFunc) => {
    const data = (await getDoc(doc(db, "types", categoryName))).data();
    saveFunc(data.array);
  };

  return (
    <>
      <Box sx={{ pb: "10px" }}>
        <DialogContent sx={{ maxWidth: "1000px", paddingX: "25px", paddingTop: "30px" }}>
          <Box component="div" sx={{ mb: 6 }}>
            <Button variant="contained" onClick={() => setShowPhotosForm(true)}>
              upload photos to storage
            </Button>
            <Box component="div" sx={{ overflowY: "auto", maxHeight: "210px", maxWidth: "500px" }}>
              {uploadedPhotos.map((photo, index) => (
                <Box key={index}>
                  <Stack sx={{ m: 2 }}>
                    <Stack direction="row" sx={{ my: 1 }}>
                      <Box component="span" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                        {photo.url}
                      </Box>
                      <StyledTooltip textToCopy={photo.url}>
                        <Button size="small" sx={{ ml: 3 }}>
                          Copy
                        </Button>
                      </StyledTooltip>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "grid", gap: 5, gridTemplateColumns: "repeat(2, 1fr)" }}>
              <ControlledInput control={control} formName="name" label="Product name" />
              <ControlledInput control={control} formName="price" label="Price" type="number" />
              <ControlledSelect control={control} formName="collection" itemsArray={collectionArray} multiple={true} />
              <ControlledSelect control={control} formName="sizes" itemsArray={sizeArray} multiple={true} />
              <ControlledSelect control={control} formName="category" itemsArray={categoriesList} />
              <ControlledSelect control={control} formName="podcategory" itemsArray={podcategoriesList} multiple={true} />
              <ControlledSelect control={control} formName="colors" itemsArray={colorArray} multiple={true} />
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
                  onClick={() => {
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
                        <StyledTooltip textToCopy={field.src}>
                          <Button size="small" sx={{ ml: 3 }}>
                            Copy
                          </Button>
                        </StyledTooltip>
                        <Button
                          variant="contained"
                          startIcon={<DeleteIcon />}
                          color="error"
                          size="small"
                          sx={{ ml: 3 }}
                          onClick={() => imagesRemove(index)}
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
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSubmit(onSubmit)()}>
            Save
          </Button>
        </DialogActions>
      </Box>
      {showPhotosForm && <PhotosForm setShowPhotosForm={setShowPhotosForm} action={setUploadedPhotos} />}
    </>
  );
};

export default ProductForm;
