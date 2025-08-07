import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Stack, Pagination, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderService from '../../services/api/OrderService';
import OrderFilter from './OrderFilter';
import OrderTable from './OrderTable';
import OrderDetailsModal from './OrderDetailsModal';

const MyOrders = () => {
  const currentDate = new Date();
  const fourYearsAgo = new Date();
  fourYearsAgo.setFullYear(currentDate.getFullYear() - 4);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const defaultStartDate = formatDate(fourYearsAgo);
  const defaultEndDate = formatDate(currentDate);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);

  const orderStatuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const [selectedStatus, setSelectedStatus] = useState('All');

  const userId = useSelector((state) => state.orebiReducer.userInfo._id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const fetchOrders = useCallback(async () => {
    const page = searchParams.get('page') || 1;
    const statusFilter = selectedStatus === 'All' ? '' : selectedStatus;
    const response = await OrderService.getOrdersByUserId(userId, page, 5, startDate, endDate, statusFilter);
    setOrders(response.orders);
    setTotalPages(response.totalPages);
    setCurrentPageNumber(Number(page));
  }, [userId, searchParams, startDate, endDate, selectedStatus]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const handleChangePage = (event, value) => {
    setCurrentPageNumber(value);
    navigate(`/order-history?page=${value}`);
  };

  return (
    <Box maxWidth="lg" mx="auto" px={4}>
      <Typography variant="h4" gutterBottom>
        Lịch sử đơn hàng
      </Typography>
      <OrderFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchOrders={fetchOrders}
        orderStatuses={orderStatuses}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      {orders.length > 0 ? (
        <Box>
          <OrderTable orders={orders} handleOpen={handleOpen} />
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Pagination
              page={currentPageNumber}
              count={totalPages}
              onChange={handleChangePage}
              showFirstButton
              showLastButton
              sx={{ display: 'flex', justifyContent: 'center' }}
            />
          </Stack>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={5}>
          <Typography variant="h5" gutterBottom>Không tìm thấy đơn hàng nào.</Typography>
          <Typography variant="body1" textAlign="center">Có vẻ như bạn chưa đặt hàng nào.</Typography>
          <Button variant="contained" color="primary" href="/shop" sx={{ mt: 2 }}>
            Tiếp tục đặt hàng
          </Button>
        </Box>
      )}
      <OrderDetailsModal open={open} handleClose={handleClose} selectedItem={selectedItem} />
    </Box>
  );
};

export default MyOrders;
