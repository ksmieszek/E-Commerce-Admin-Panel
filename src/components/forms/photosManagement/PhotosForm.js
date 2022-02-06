import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import LoadingButton from "@mui/lab/LoadingButton";

const storage = getStorage();

const PhotosForm = ({ setShowForm, save }) => {
  const { handleSubmit, watch, register } = useForm();

  const onSubmit = async ({ images }) => {
    if (images.length < 1) return;
    const files = [];
    for (let i = 0; i < images.length; i++) {
      const image = await uploadImage(images[i]);
      files.push(image);
    }
    save(files);
    setShowForm(false);
  };

  const watchImages = watch("images");
  const [chosenFiles, setChosenFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (watchImages === undefined || watchImages.length < 1) {
      setChosenFiles([]);
      return;
    }
    const fileNames = [];
    for (let i = 0; i < watchImages.length; i++) fileNames.push(watchImages[i].name);
    setChosenFiles(fileNames);
  }, [watchImages]);

  async function uploadImage(file) {
    const fileName = file.name;
    const imageRef = ref(storage, `images/${fileName}`);
    const photo = {};
    setLoading(true);
    await uploadBytes(imageRef, file).then(async (snapshot) => {
      const { updated, name, size } = snapshot.metadata;
      photo.updated = updated;
      photo.name = name;
      photo.size = size;
      await getDownloadURL(imageRef).then((url) => {
        photo.url = url;
      });
    });
    setLoading(false);
    return photo;
  }

  return (
    <Dialog
      open={true}
      fullWidth={false}
      maxWidth="lg"
      onClose={() => setShowForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ paddingY: "10px", minWidth: "600px" }}>
        <DialogContent sx={{ maxWidth: "1000px", paddingX: "30px", paddingTop: "30px" }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Button variant="contained" component="label">
              Choose images
              <input hidden type="file" accept="image/*" multiple {...register("images")} required />
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            {chosenFiles.map((item, index) => (
              <Typography paragraph={true} key={index}>
                {item}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3 }}>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit(onSubmit)()}>
            Upload
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PhotosForm;
