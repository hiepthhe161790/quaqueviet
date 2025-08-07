import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, MenuItem, Select, Grid, Card, CardContent, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiShoppingCart } from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import OrderService from '../../../services/api/OrderService';

export default function ProfitsDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM-DD'));
  const [yearlySummary, setYearlySummary] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        const response = await OrderService.getAllProfitsByYear(selectedYear);
        setYearlySummary(response.yearlySummary);
        setYearlyData(response.monthlyData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu lợi nhuận theo năm:', error);
      }
    };
    fetchYearlyData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const data = await OrderService.getProfitByMonth(
          `${dayjs(selectedMonth).year()}-${dayjs(selectedMonth).month() + 1}`
        );
        setMonthlyData(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu lợi nhuận tháng:', error);
      }
    };
    fetchMonthlyData();
  }, [selectedMonth]);

  const handleDownloadFile = async () => {
    try {
      await OrderService.exportProfitsByYear(selectedYear);
    } catch (error) {
      console.error('Lỗi khi tải file:', error);
    }
  };

  return (
<Box sx={{ width: '100%', p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
    <BsGraphUp style={{ marginRight: 8 }} /> Thống kê lợi nhuận của công ty
  </Typography>

  {/* Year selection */}
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Năm</InputLabel>
    <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
      {[...Array(5)].map((_, index) => (
        <MenuItem key={currentYear - index} value={currentYear - index}>
          {currentYear - index}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Profit overview */}
  {yearlySummary && (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[
        { label: 'Tổng doanh thu', value: yearlySummary.totalRevenue, icon: <FiDollarSign size={24} color="#4caf50" /> },
        { label: 'Tổng chi phí', value: yearlySummary.totalCost, icon: <FiTrendingDown size={24} color="#f44336" /> },
        { label: 'Tổng lợi nhuận', value: yearlySummary.totalProfit, icon: <FiTrendingUp size={24} color="#2196f3" /> },
        { label: 'Tổng đơn hàng', value: yearlySummary.totalOrders, icon: <FiShoppingCart size={24} color="#ff9800" /> }
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                {stat.icon}
              </Box>
              <Typography variant="subtitle1" fontSize={{ xs: '0.9rem', sm: '1rem' }}>{stat.label}</Typography>
              <Typography variant="h6" color="primary" fontSize={{ xs: '1rem', sm: '1.25rem' }}>{stat.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}

  {/* Monthly profit chart */}
  <Box sx={{ overflowX: 'auto' }}>
    <BarChart
      dataset={yearlyData}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[{ dataKey: 'totalProfit', label: 'Lợi nhuận', valueFormatter: (v) => `${v} VND` }]}
      height={300}
    />
  </Box>

  <Grid container spacing={2} sx={{ mt: 3 }}>
    {/* Month picker */}
    <Grid item xs={12} md={5}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={dayjs(selectedMonth)}
          onChange={(newValue) => setSelectedMonth(newValue.format('YYYY-MM-DD'))}
          views={['month']}
          openTo="month"
        />
      </LocalizationProvider>
    </Grid>

    {/* Monthly statistics */}
    <Grid item xs={12} md={7}>
      {monthlyData && (
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Thống kê hàng tháng
            </Typography>
            {[
              { label: 'Doanh thu', value: monthlyData.totalRevenue, icon: <FiDollarSign size={20} color="#4caf50" /> },
              { label: 'Chi phí', value: monthlyData.totalCost, icon: <FiTrendingDown size={20} color="#f44336" /> },
              { label: 'Lợi nhuận', value: monthlyData.totalProfit, icon: <FiTrendingUp size={20} color="#2196f3" /> },
              { label: 'Đơn hàng', value: monthlyData.totalOrders, icon: <FiShoppingCart size={20} color="#ff9800" /> },
              {
                label: 'Sản phẩm bán chạy',
                value: monthlyData.bestSellerItem
                  ? `${monthlyData.bestSellerItem.name} (${monthlyData.bestSellerItem.quantity} đã bán)`
                  : 'N/A',
                icon: <BsGraphUp size={20} color="#673ab7" />
              }
            ].map((stat, index) => (
              <Typography key={index} sx={{ mt: 1, display: 'flex', alignItems: 'center', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {stat.icon}
                <strong style={{ marginLeft: 8 }}>{stat.label}:</strong> {stat.value}
              </Typography>
            ))}
            <Button onClick={handleDownloadFile} variant="contained" sx={{ mt: 2 }} endIcon={<SimCardDownloadIcon />}>
              Tải xuống báo cáo
            </Button>
          </CardContent>
        </Card>
      )}
    </Grid>
  </Grid>
</Box>
  );
}