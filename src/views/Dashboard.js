import * as React from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import routes from "routes";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chart from "components/dashboard/Chart";
import OrdersTable from "components/dashboard/OrdersTable";

const Dashboard = () => (
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <Stack sx={{ minWidth: "800px", width: "1200px" }} spacing={4}>
      <Typography variant="h5">Dashboard</Typography>
      <Chart />
      <Paper sx={{ p: 3 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Recent Orders
        </Typography>
        <OrdersTable limit={5} paginate={false} />
        <Box sx={{ mt: 3 }}>
          <Link color="primary" component={RouterLink} to={routes.orders}>
            See more orders
          </Link>
        </Box>
      </Paper>
    </Stack>
  </Box>
);

export default Dashboard;
