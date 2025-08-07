// OrderDialog.js
import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';

const OrderDialog = ({ open, onClose, order, onChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{order?.id ? 'Edit Order' : 'Create Order'}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="userId"
        label="ID người dùng"
        fullWidth
        value={order?.userId || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="items"
        label="Mặt hàng"
        fullWidth
        value={order?.items || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="totalPrice"
        label="Tổng giá"
        fullWidth
        value={order?.totalPrice || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="orderStatus"
        label="Trạng thái đơn hàng"
        fullWidth
        value={order?.orderStatus || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="paymentStatus"
        label="Trạng thái thanh toán"
        fullWidth
        value={order?.paymentStatus || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="paymentDetails"
        label="Chi tiết thanh toán"
        fullWidth
        value={order?.paymentDetails || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="contactInfo"
        label="Thông tin liên lạc"
        fullWidth
        value={order?.contactInfo || ''}
        onChange={onChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Hủy bỏ
      </Button>
      <Button onClick={onSubmit} color="primary">
        {order?.id ? 'Update' : 'Create'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default OrderDialog;
