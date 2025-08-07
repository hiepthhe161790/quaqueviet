import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function OrderDetailDialog({ order }) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title="View payment detail">
                <PointOfSaleIcon fontSize='small' color="info" onClick={() => handleClickOpen()}></PointOfSaleIcon>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {
                        order && order?.items && order?.items.length > 0 && (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={3}>
                                                Chi tiết
                                            </TableCell>
                                            <TableCell align="right">Giá</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Tên</TableCell>
                                            <TableCell >Color</TableCell>
                                            <TableCell align="right">Số lượng</TableCell>
                                            <TableCell align="right">Giá</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order?.items.map((item) => (
                                            <TableRow key={item?._id}>
                                                <TableCell>{item?.productId?.name}</TableCell>
                                                <TableCell >{item?.variant }</TableCell>
                                                <TableCell align="right">{item?.quantity}</TableCell>
                                                <TableCell align="right">{item?.salePrice}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell>Phí vận chuyển</TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right">{order?.shippingFee || 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Tổng</TableCell>
                                            <TableCell align="right">{order?.totalPrice}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy bỏ</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
