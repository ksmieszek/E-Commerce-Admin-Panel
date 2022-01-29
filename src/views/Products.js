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
import { Typography } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";

const Products = () => {
  const { control } = useForm();
  const {
    fields: productsFields,
    prepend: productPrepend,
    replace: productsReplace,
    remove: productsRemove,
  } = useFieldArray({ control, name: "products", keyName: "idInList" });

  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    (async () => {
      const productsArray = [];
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        const { name, price, frontImage, backImage, category, podcategory, images, colors, sizes, sex } = doc.data();
        productsArray.push({ id: doc.id, name, price, frontImage, backImage, category, podcategory, images, colors, sizes, sex });
      });
      productsReplace(productsArray);
    })();
  }, []);

  const action = (values) => {
    if (values.id) editItem(values);
    else addItem(values);
  };
  const addItem = async ({ id, ...rest }) => {
    addDoc(collection(db, "products"), {
      ...rest,
    }).then((res) => {
      productPrepend({ id: res.id, ...rest });
    });
  };
  const editItem = async ({ id, ...rest }) => {
    setDoc(doc(db, "products", id), { ...rest }, { merge: true }).then(() => {
      productsReplace([...productsFields].map((item) => (item.id === id ? { id, ...rest } : item)));
    });
  };
  const deleteItem = (e, params) => {
    e.stopPropagation();
    const idInList = params.getValue(params.id, "idInList");
    const productId = params.getValue(params.id, "id");
    const indexInList = productsFields.findIndex((item) => item.idInList === idInList);
    deleteDoc(doc(db, "products", productId)).then(() => productsRemove(indexInList));
  };

  const addAction = async (e) => {
    e.stopPropagation();
    setEditValues({});
    setShowForm(true);
  };
  const editAction = async (e, params) => {
    e.stopPropagation();
    setEditValues(params.row);
    setShowForm(true);
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
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.join(", ")}</p>,
    },
    {
      field: "podcategory",
      headerName: "Podcategory",
      width: 200,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value.join(", ")}</p>,
    },
    {
      field: "price",
      headerName: "Price(PLN)",
      width: 200,
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
          <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={(e) => editAction(e, params)}>
            Edit
          </Button>
          <Button variant="contained" startIcon={<DeleteIcon />} color="error" size="small" onClick={(e) => deleteItem(e, params)}>
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
      <Button variant="contained" sx={{ my: 2 }} startIcon={<AddIcon />} onClick={(e) => addAction(e)}>
        Add product
      </Button>

      <div style={{ height: 1130, width: 1350, marginTop: "40px" }}>
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
      </div>
      {showForm && <ProductForm setShowForm={setShowForm} save={action} editValues={editValues} />}
    </Box>
  );
};

export default Products;
