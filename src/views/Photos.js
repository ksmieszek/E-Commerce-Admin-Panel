import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { useDialog } from "hooks/useDialog";
import { getStorage, ref, listAll, getDownloadURL, getMetadata, deleteObject } from "firebase/storage";
import PhotosForm from "components/forms/photosManagement/PhotosForm";
import StyledTooltip from "components/mui/StyledTooltip";
import DeleteForm from "components/mui/DeleteForm";

const storage = getStorage();
const folderRef = ref(storage, "images");

const Photos = () => {
  const { control } = useForm();
  const { fields, replace, remove, prepend } = useFieldArray({ control, name: "photos" });
  const [showPhotosForm, setShowPhotosForm] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    (async () => {
      const photosArray = [];
      const list = await listAll(folderRef).then((res) => res.items);
      await Promise.all(
        list.map(async (itemRef) => {
          const photo = {};
          await getDownloadURL(itemRef).then((url) => {
            photo.url = url;
          });
          await getMetadata(itemRef).then((metadata) => {
            const { updated, name, size } = metadata;
            photo.updated = updated;
            photo.name = name;
            photo.size = size;
          });
          photosArray.push(photo);
        })
      );
      replace(photosArray);
    })();
  }, []);

  const addItem = (files) => {
    files.forEach((item) => prepend(item));
  };

  const deleteItem = (params) => {
    const action = () => {
      const photoName = params.getValue(params.id, "name");
      const photoRef = ref(storage, `images/${photoName}`);
      deleteObject(photoRef).then(() => {
        const indexInList = fields.findIndex((item) => item.id === params.id);
        remove(indexInList);
      });
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <img src={params.getValue(params.id, "url")} alt="" style={{ maxWidth: "120px", maxHeight: "150px" }} />
        </div>
      ),
    },
    {
      field: "url",
      headerName: "Photo url",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <StyledTooltip textToCopy={params.value}>
            <Button size="small">Copy Url</Button>
          </StyledTooltip>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Photo name",
      width: 250,
      sortable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value}</p>,
    },
    {
      field: "size",
      headerName: "Photo size",
      width: 200,
      filterable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{(params.value / 1000).toFixed(1)} KB</p>,
    },
    {
      field: "updated",
      headerName: "Uploaded",
      width: 250,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.split("T")[0]}</p>,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button variant="contained" startIcon={<DeleteIcon />} color="error" size="small" onClick={(e) => deleteItem(params)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Photos management
      </Typography>
      <Button variant="contained" sx={{ my: 2 }} startIcon={<AddIcon />} onClick={() => setShowPhotosForm(true)}>
        Add photo
      </Button>
      <Paper sx={{ height: 1130, width: 1350, marginTop: "40px" }}>
        <DataGrid
          rowHeight={200}
          rows={fields}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          hideFooterSelectedRowCount
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Paper>
      {showPhotosForm && <PhotosForm setShowPhotosForm={setShowPhotosForm} action={addItem} />}
    </Box>
  );
};

export default Photos;
