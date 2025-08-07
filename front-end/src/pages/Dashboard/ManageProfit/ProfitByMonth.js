import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import OrderService from '../../../services/api/OrderService';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
export default function ProfitByMonth() {
  const [profitData, setProfitData] = useState([]);
  const [dayJsValue, setDayJsValue] = React.useState(dayjs(`${dayjs().get('year')}-${dayjs().get('month')}-${dayjs().get('date')}`));
  useEffect(() => {
    const getAllProfits = async () => {
      const data = await OrderService.getProfitByMonth(`${dayJsValue.year()}-${dayJsValue.month() + 1}`);
      setProfitData(data);
    }
    getAllProfits();
  }, [dayJsValue])

  const handleDownloadFile = async () => {
    await OrderService.exportProfitsByYear(2024);
  }

  return (
    <Grid container>
      <Grid item xs={5} md={5}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayJsValue} onChange={(newValue) => setDayJsValue(newValue)}
            views={['month']}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={7} md={7}>
        <TableContainer>
          <Table >
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>Tổng doanh thu</TableCell>
                {profitData?.totalRevenue > 0 && <TableCell align="right">{profitData?.totalRevenue} VND</TableCell>}
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tổng chi phí</TableCell>
                {profitData?.totalCost > 0 && <TableCell align="right">{profitData?.totalCost} VND</TableCell>}
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tổng lợi nhuận</TableCell>
                {profitData?.totalProfit > 0 && <TableCell align="right">{profitData?.totalProfit} VND</TableCell>}
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tổng đơn hàng</TableCell>
                {profitData.totalOrders > 0 && <TableCell align="right">{profitData?.totalOrders} orders</TableCell>}
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Sản phẩm bán chạy nhất</TableCell>
                {profitData?.bestSellerItem?.name && <TableCell align="right"> {`${profitData?.bestSellerItem?.name} (${profitData?.bestSellerItem?.quantity} products sold)`}</TableCell>}
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right">
                  <Button onClick={handleDownloadFile} variant="contained" endIcon={<SimCardDownloadIcon />}>
                    Xuất XLSX
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>

  );
}
