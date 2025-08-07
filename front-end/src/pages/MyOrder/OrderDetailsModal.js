import React from 'react';
import { Modal, Box, Typography, Divider } from '@mui/material';
import ProductService from '../../services/api/ProductService';
import ImgDefault from '../../assets/images/default.jpg';
const OrderDetailsModal = ({ open, handleClose, selectedItem }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    },
                }}
            >
                {selectedItem && (
                    <>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Chi tiết đơn hàng
                        </Typography>
                        <Divider />
                        {selectedItem.items.map((item, index) => (
                            <Box key={index} my={2}>
                                <Box display="flex" alignItems="center">
                                    <img
                                        className="w-24"
                                        src={
                                            item.productId.images && item.productId.images.length > 0
                                                ? ProductService.getImage(item.productId.images[0].filename)
                                                : ImgDefault
                                        }
                                        alt={item?.productId?.name}
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', marginRight: '16px' }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">
                                            <strong>Tên:</strong> {item?.productId?.name}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            <strong>Giá bán:</strong> {item.salePrice}đ
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            <strong>Số lượng:</strong> {item.quantity}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            <strong>Biến thể:</strong> {item.variant }
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            <strong>Thông số kỹ thuật:</strong> {item?.productId?.specs.map(spec => `${spec.key}: ${spec.value}`).join(', ')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        <Divider />
                        <Box my={2}>
                            <Typography variant="h6" component="h3" gutterBottom>
                               Thông tin thanh toán
                            </Typography>
                            <Typography variant="body1">
                                <strong>Tổng cộng:</strong> {selectedItem.totalPrice}đ
                            </Typography>
                            <Typography variant="body1">
                                <strong>Trạng thái thanh toán:</strong> {selectedItem.paymentStatus}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phương thức thanh toán:</strong> {selectedItem.paymentMethod}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box my={2}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Thông tin liên lạc
                            </Typography>
                            <Typography variant="body1">
                                {selectedItem?.contactInfo
                                    ? `${selectedItem.contactInfo.name}, ${selectedItem.contactInfo.email}, ${selectedItem.contactInfo.phone}, ${selectedItem.contactInfo.address}`
                                    : 'N/A'}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default OrderDetailsModal;
