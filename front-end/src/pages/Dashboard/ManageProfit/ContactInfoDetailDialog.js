import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ContactInfoDetailDialog({ user, contactInfo }) {
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
                <AssignmentIndIcon fontSize='small' color="info" onClick={() => handleClickOpen()}></AssignmentIndIcon>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Customer Contact Information</DialogTitle>
                <DialogContent>
                    {
                        contactInfo && (<TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên</TableCell>
                                        <TableCell >Email</TableCell>
                                        <TableCell >Số điện thoại</TableCell>
                                        <TableCell align='right'>Địa chỉ </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {contactInfo?.name}
                                        </TableCell>
                                        <TableCell >{contactInfo?.email}</TableCell>
                                        <TableCell >{contactInfo?.phone}</TableCell>
                                        <TableCell >{contactInfo?.address}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>)
                    }
                    {
                        !contactInfo && user && (<TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell >Email</TableCell>
                                        <TableCell >Họ tên</TableCell>
                                        <TableCell >Địa chỉ </TableCell>
                                        <TableCell align='right'>Số điện thoại </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user?._id}
                                        </TableCell>
                                        <TableCell >{user?.email}</TableCell>
                                        <TableCell >{user?.fullName}</TableCell>
                                        <TableCell >{user?.address}</TableCell>
                                        <TableCell >{user?.phoneNumber}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>)
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy bỏ</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
