import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const CouponDialog = ({ coupon }) => {
  const [open, setOpen] = useState(false);

  if (!coupon) return null;

  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        {coupon.code}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 1 }}>
            <Typography><b>Mã:</b> {coupon.code}</Typography>
            <Typography><b>Loại:</b> {coupon.type === 'percent' ? 'Phần trăm' : 'Số tiền'}</Typography>
            <Typography><b>Giá trị:</b> {coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} VND`}</Typography>
            {coupon.maxDiscount && (
              <Typography><b>Giảm tối đa:</b> {coupon.maxDiscount} VND</Typography>
            )}
            {coupon.minOrderValue && (
              <Typography><b>Đơn tối thiểu:</b> {coupon.minOrderValue} VND</Typography>
            )}
            {coupon.expiryDate && (
              <Typography><b>Hạn sử dụng:</b> {new Date(coupon.expiryDate).toLocaleDateString()}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CouponDialog;