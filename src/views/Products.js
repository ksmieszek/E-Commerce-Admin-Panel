import ProductForm from "components/forms/productsManagement/ProductForm";
import { db } from "firebase";
import { useEffect, useState } from "react";
import { collection, addDoc, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { useDialog } from "hooks/useDialog";
import DeleteForm from "components/mui/DeleteForm";

const Products = () => {
  const { control } = useForm();
  const {
    fields: productsFields,
    prepend: productPrepend,
    replace: productsReplace,
    remove: productsRemove,
  } = useFieldArray({ control, name: "products", keyName: "idInList" });
  const [pageSize, setPageSize] = useState(5);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    (async () => {
      const productsArray = [];
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        const { name, price, frontImage, backImage, category, podcategory, images, colors, sizes, collection } = doc.data();
        productsArray.push({ id: doc.id, name, price, frontImage, backImage, category, podcategory, images, colors, sizes, collection });
      });
      productsReplace(productsArray);
    })();
  }, []);

  const addItem = () => {
    const action = ({ id, category, ...rest }) => {
      addDoc(collection(db, "products"), {
        ...rest,
        category: [category],
      }).then((res) => {
        productPrepend({ id: res.id, category: [category], ...rest });
      });
    };
    setDialogContent(<ProductForm action={action} editValues={{}} />);
    setDialogSize("md");
    setDialogTitle("Product form");
    openDialog();
  };

  const editItem = (params) => {
    const action = ({ id, category, ...rest }) => {
      setDoc(doc(db, "products", id), { ...rest, category: [category] }, { merge: true }).then(() => {
        productsReplace([...productsFields].map((item) => (item.id === id ? { id, category: [category], ...rest } : item)));
      });
    };
    setDialogContent(<ProductForm action={action} editValues={params.row} />);
    setDialogSize("md");
    setDialogTitle("Product form");
    openDialog();
  };

  const deleteItem = (params) => {
    const action = () => {
      const idInList = params.getValue(params.id, "idInList");
      const productId = params.getValue(params.id, "id");
      const indexInList = productsFields.findIndex((item) => item.idInList === idInList);
      deleteDoc(doc(db, "products", productId)).then(() => productsRemove(indexInList));
    };
    setDialogContent(<DeleteForm action={action} />);
    setDialogSize("sm");
    setDialogTitle("Are you sure you want to delete this item?");
    openDialog();
  };

  const columns = [
    {
      field: "mainImages",
      headerName: "Main images",
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
          <img src={params.getValue(params.id, "frontImage") || ""} width="100px" height="150px" alt="" />
          <img src={params.getValue(params.id, "backImage") || ""} width="100px" height="150px" alt="" />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Product name",
      width: 250,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value}</p>,
    },
    {
      field: "collection",
      headerName: "Collection",
      width: 200,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.join(", ")}</p>,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      sortable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.join(", ")}</p>,
    },
    {
      field: "podcategory",
      headerName: "Podcategory",
      width: 200,
      sortable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.join(", ")}</p>,
    },
    {
      field: "price",
      headerName: "Price(PLN)",
      width: 180,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack spacing={2}>
          <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={() => editItem(params)}>
            Edit
          </Button>
          <Button variant="contained" startIcon={<DeleteIcon />} color="error" size="small" onClick={() => deleteItem(params)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Products management
      </Typography>
      <Button variant="contained" sx={{ my: 2 }} startIcon={<AddIcon />} onClick={addItem}>
        Add product
      </Button>
      <Paper sx={{ height: 1130, width: 1500, marginTop: "40px" }}>
        <DataGrid
          rowHeight={200}
          rows={productsFields}
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
    </Box>
  );
};

export default Products;
