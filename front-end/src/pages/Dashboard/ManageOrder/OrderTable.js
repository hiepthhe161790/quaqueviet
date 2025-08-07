// OrderTable.js
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const OrderTable = ({ orders, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID Người dùng</TableCell>
          <TableCell>Mặt hàng</TableCell>
          <TableCell>Tổng giá</TableCell>
          <TableCell>Trạng thái đơn hàng</TableCell>
          <TableCell>Trạng thái thanh toán</TableCell>
          <TableCell>Chi tiết thanh toán</TableCell>
          <TableCell>Thông tin liên lạc</TableCell>
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.userId}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.totalPrice}</TableCell>
            <TableCell>{order.orderStatus}</TableCell>
            <TableCell>{order.paymentStatus}</TableCell>
            <TableCell>{order.paymentDetails}</TableCell>
            <TableCell>{order.contactInfo}</TableCell>
            <TableCell>
              <Tooltip title="Edit">
                <IconButton color="primary" onClick={() => onEdit(order)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => onDelete(order.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OrderTable;
