import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import UserService from '../../../services/api/UserService'
import UpdateAccount from './UpdateAccount';
export default function Accounts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParams = parseInt(searchParams.get('page') || 1);
  const keywordsParams = searchParams.get('keywords');
  const sortByParams = searchParams.get('sortBy');
  // Các state params
  const [keywords, setKeywords] = React.useState(keywordsParams || '');

  // handle fetch data
  const [accountData, setAccountData] = React.useState({ accounts: [], totalPages: 0 });
  React.useEffect(() => {
    const fetchAccounts = async () => {
      const data = await UserService.getPaginatedUsers(pageParams, 10, keywordsParams, sortByParams);
      setAccountData(data);
    };
    fetchAccounts();
  }, [pageParams, keywordsParams, sortByParams])

  const handleNavigate = (params) => {
    !params.page && pageParams && (params.page = pageParams)
    !params.keywords && keywordsParams && (params.keywords = keywordsParams)
    !params.sortBy && sortByParams && (params.sortBy = sortByParams);
    params.keywords === 'all' && delete params.keywords
    params.sortBy === 'all' && delete params.sortBy
    params.sortBy === sortByParams && delete params.sortBy
    navigate({
      pathname: '/manage-account',
      search: createSearchParams(params).toString()
    });
  }

  const handleChangePage = (event, value) => {
    const params = {
      page: value
    }
    handleNavigate(params);
  }

  const handleSearchByKeywords = async () => {
    const params = {
      page: 1,
      sortBy: "all"
    }
    if (keywords.trim().length === 0) {
      params.keywords = "all"
    } else {
      params.keywords = keywords.trim();
    }
    handleNavigate(params);
  }

  const handleSortAccount = (sortByValue) => {
    const params = {
      sortBy: sortByValue
    }
    handleNavigate(params);
  }

  // Xử lý xóa account
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [openAskToDelete, setOpenAskToDelete] = React.useState(false);

  const handleOpenAskToDelete = (userId) => {
    setSelectedUserId(userId);
    setOpenAskToDelete(true);
  };

  const handleSoftDeleteAccount = async () => {
    await UserService.softDeleteUser(selectedUserId);
    const data = await UserService.getPaginatedUsers(pageParams, 10, keywordsParams, sortByParams);
    setAccountData(data);
    setOpenAskToDelete(false);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <TextField required value={keywords} onChange={(e) => setKeywords(e.target.value)} size="small" fullWidth id="outlined-basic" label="Tìm kiếm email" variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSearchByKeywords} variant="contained" endIcon={<SearchIcon />}>
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
      {
        accountData?.accounts && (
          <Grid item>
            <Typography color="error" variant="caption" display="block" gutterBottom>
              Found {accountData?.totalaccounts} tài khoản
            </Typography>
          </Grid>
        )
      }
      <Grid item xs={12}>
        <Title>Quản lí tài khoản</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("email")}>Email</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("fullName")}>Tên</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("address")}>Địa chỉ</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("phoneNumber")}>Số điện thoại</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("role")}>Vai trò</Typography></TableCell>
              <TableCell ><Typography color="primary"  >OTP</Typography></TableCell>
              <TableCell ><Typography color="primary"  >OTP Hết hạn</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortAccount("isVerified")}>Đã xác minh</Typography></TableCell>
              <TableCell ><Typography color="primary"  >Hành động</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountData?.users?.map((user) => (
              <TableRow style={{ cursor: 'pointer' }} key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.otp}</TableCell>
                <TableCell>{user.otpExpires}</TableCell>
                <TableCell >{user.isVerified?.toString()}</TableCell>
                <TableCell >
                  <Box display="flex" alignItems="center">
                    <UpdateAccount style={{ cursor: 'pointer' }} user={user}></UpdateAccount>
                    <Tooltip title="Delete">
                      <DeleteIcon color="error" style={{ cursor: 'pointer' }} onClick={() => handleOpenAskToDelete(user._id)} />
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            page={parseInt(searchParams.get('page')) || 1}
            count={accountData.totalPages}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </Stack>

      </Grid>
      <Grid>
        <Dialog
          open={openAskToDelete}
          onClose={() => setOpenAskToDelete(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có muốn vô hiệu hóa tài khoản này không?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Tắt bản ghi này về cơ bản chỉ là xóa tạm thời. Bạn có thể xem lại các bản ghi đã xóa trong thùng rác nhưng không thể khôi phục chúng.            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAskToDelete(false)}>Hủy bỏ</Button>
            <Button color='error' onClick={handleSoftDeleteAccount} autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
}
