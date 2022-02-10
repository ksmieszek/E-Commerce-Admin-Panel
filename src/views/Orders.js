import Paper from "@mui/material/Paper";
import OrdersTable from "components/dashboard/OrdersTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Orders = () => (
  <Box>
    <Typography variant="h5" sx={{ mt: 2, mb: 5 }}>
      Orders
    </Typography>
    <Paper sx={{ minWidth: "800px", width: "1200px", p: 3 }}>
      <OrdersTable />
    </Paper>
  </Box>
);

export default Orders;
