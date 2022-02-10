import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { XAxis, YAxis, Label, ResponsiveContainer, AreaChart, CartesianGrid, Area, Tooltip } from "recharts";
import { db } from "firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { Paper, Typography } from "@mui/material";

const Chart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const todayDate = new Date(new Date().setHours(24, 0, 0, 0));
    const todayTimestamp = Timestamp.fromDate(todayDate);
    let chartDataArray = [];
    //fill chartDataArray with initial values
    for (let i = 0; i < 7; i++) {
      const copyTodayDate = new Date(todayDate);
      const otherDate = new Date(copyTodayDate.setDate(todayDate.getDate() - i));
      const formatOtherDate = otherDate.toISOString().split("T")[0];
      chartDataArray.push({ date: formatOtherDate, amount: 0 });
    }

    (async () => {
      const weekAgoDate = new Date(todayDate.setDate(todayDate.getDate() - 6));
      const weekAgoTimestamp = Timestamp.fromDate(weekAgoDate);

      const querySnapshot = await getDocs(
        query(collection(db, "orders"), where("date", "<=", todayTimestamp), where("date", ">=", weekAgoTimestamp))
      );
      querySnapshot.forEach((doc) => {
        const { cartValue, date } = doc.data();
        const orderDate = date.toDate().toISOString().split("T")[0];
        chartDataArray = chartDataArray.map((item) => {
          if (item.date === orderDate) item.amount = parseFloat((parseFloat(item.amount) + parseFloat(cartValue)).toFixed(2));
          return item;
        });
      });
      setChartData(chartDataArray.reverse());
    })();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Last week
      </Typography>
      <ResponsiveContainer height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 50, left: 25, bottom: 0 }}>
          <XAxis dataKey="date" style={theme.typography.body2} />
          <YAxis style={theme.typography.body2}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Amount (PLN)
            </Label>
          </YAxis>
          <CartesianGrid strokeDasharray="3" />
          <Tooltip />
          <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default Chart;
