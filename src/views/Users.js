import { db } from "firebase";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import UserRoleForm from "components/forms/userManagement/UserRoleForm";
import { useDialog } from "hooks/useDialog";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const { openDialog, setDialogContent, setDialogTitle, setDialogSize } = useDialog();

  useEffect(() => {
    (async () => {
      const usersArray = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const {
          roles: { admin },
          email,
        } = doc.data();
        usersArray.push({ id: doc.id, isAdmin: admin, email });
      });
      setUsers(usersArray);
    })();
  }, []);

  const editItem = (params) => {
    const action = (values) => {
      const { admin, id } = values;
      setDoc(doc(db, "users", id), { roles: { admin: admin === "true" } }, { merge: true }).then(() => {
        setUsers([...users].map((item) => (item.id === id ? { ...item, isAdmin: admin === "true" } : item)));
      });
    };
    setDialogContent(<UserRoleForm action={action} editValues={params.row} />);
    setDialogSize("sm");
    setDialogTitle("Change user role");
    openDialog();
  };

  const columns = [
    {
      field: "email",
      headerName: "Identifier",
      width: 300,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value}</p>,
    },
    {
      field: "isAdmin",
      headerName: "User role",
      width: 150,
      sortable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value ? "admin" : "user"}</p>,
    },
    {
      field: "id",
      headerName: "User UID",
      width: 330,
      sortable: false,
      renderCell: (params) => <p style={{ whiteSpace: "normal" }}>{params.value}</p>,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={() => editItem(params)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Users management
      </Typography>
      <Paper sx={{ height: 740, width: 1000, marginTop: "40px" }}>
        <DataGrid
          rowHeight={60}
          rows={users}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 50]}
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

export default Users;
