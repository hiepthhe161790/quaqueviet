import React, { useState } from 'react';
import { Button, Box, TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import SearchProduct from './SearchProduct';
import OrderService from '../../../services/api/OrderService';
import { useNavigate } from 'react-router-dom';

const CreateOrderModal = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      toast.error('Please fill out all required fields.');
      return;
    }
    const orderData = {
      items,
      contactInfo,
      paymentMethod,
    };
    try {
      await OrderService.createOrder(orderData);
      toast.success('Create order successfully');
      setTimeout(() => {
        navigate('/manage-order');
      }, 3000);
      onClose();
    } catch (error) {
      toast.error('Error creating order');
    }
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo đơn hàng</DialogTitle>
      <DialogContent>
        <ToastContainer />
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên"
                variant="outlined"
                fullWidth
                name="name"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                name="address"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="Cash On Delivery">Thanh toán khi nhận hàng</MenuItem>
                  <MenuItem value="VnPay">VnPay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <SearchProduct items={items} setItems={setItems} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy bỏ</Button>
        <Button onClick={handleCreateOrder} color="primary">Tạo đơn hàng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal;
