import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { db } from "firebase";
import { collection, getDocs } from "firebase/firestore";

const OrdersTable = ({ limit, paginate = true }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const ordersArray = [];
      const querySnapshot = await getDocs(collection(db, "orders"));
      querySnapshot.forEach((doc) => {
        const {
          cartValue,
          deliveryInfo: { email, city, postalCode },
          date,
        } = doc.data();
        const convertToDate = date.toDate().toISOString().split("T")[0];
        ordersArray.push({ id: doc.id, date: convertToDate, cartValue, email, city, postalCode });
      });
      ordersArray.sort((a, b) => (a.date > b.date ? -1 : 1));
      if (!paginate) ordersArray.splice(limit);
      setOrders(ordersArray);
    })();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Identifier</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Postal code</TableCell>
              <TableCell align="right">Sale amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.postalCode}</TableCell>
                <TableCell align="right">{row.cartValue} PLN</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {paginate && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          sx={{ mt: 2 }}
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default OrdersTable;
