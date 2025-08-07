import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Notification from './Notification';
import UserService from '../../../services/api/UserService';

export default function AddAccount() {
    // các state nhỏ
    const [openAddUserDialog, setOpenAddUserDialog] = React.useState(false);

    // Các state form data
    const [email, setEmail] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");

    // Xử lý notification
    const [showNotification, setShowNotification] = React.useState(false);
    const [contentNotification, setContentNotification] = React.useState("");
    const [severity, setSeriverity] = React.useState("info");
    const handleShowNotification = (isShowNotification) => {
        setShowNotification(isShowNotification);
    }
    // Xong phần xử lý notification


    const handleResetForm = () => {
        setEmail("");
        setFullName("");
        setAddress("");
        setPhoneNumber("");
        setPassword("");
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        const result = await UserService.addUser(email, password, fullName, address, phoneNumber);
        if (result?.success && result.success === true) {
            setShowNotification(true);
            setContentNotification("Add user successfully!");
            setSeriverity("success");
            handleResetForm();
        } else {
            setShowNotification(true);
            setContentNotification(result.data.message);
            setSeriverity("error");
        }
    };


    const handleClickopenAddUserDialog = () => {
        setOpenAddUserDialog(true);
    };
    const handleCloseAddUserDialog = () => {
        setOpenAddUserDialog(false);
    };
    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <>
            <Tooltip title="Add new account" TransitionComponent={Zoom} TransitionProps={{ timeout: transitionDuration }} placement="left" arrow>
                <Zoom
                    key='primary'
                    in={true}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit
                >

                    <Fab aria-label='Add' color='primary' >
                        <React.Fragment>
                            <AddIcon onClick={handleClickopenAddUserDialog}></AddIcon>
                            <Dialog
                                open={openAddUserDialog}
                                onClose={handleCloseAddUserDialog}
                                maxWidth="md"
                            >
                                <DialogTitle>Thêm tài khoản mới</DialogTitle>
                                <DialogContent>
                                    <Notification handleShowNotification={handleShowNotification} showNotification={showNotification} contentNotification={contentNotification} severity={severity} ></Notification>
                                    <DialogContentText>
                                        Để thêm tài khoản mới vào cửa hàng, vui lòng điền thông tin bên dưới và gửi yêu cầu.
                                    </DialogContentText>
                                    <Grid sx={{ mt: 3 }} container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField fullWidth id="standard-basic" label="Email" variant="standard" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth type="password" id="standard-basic" label="Mật khẩu" variant="standard" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth id="standard-basic" label="Họ tên" variant="standard" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth id="standard-basic" label="Địa chỉ" variant="standard" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth type="number" id="standard-basic" label="Số điện thoại" variant="standard" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseAddUserDialog}>Hủy bỏ</Button>
                                    <Button type="submit" onClick={handleAddUser}>Đồng ý</Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Fab>
                </Zoom>
            </Tooltip>
        </>
    );
}
