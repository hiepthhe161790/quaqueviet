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
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import OrderService from '../../../services/api/OrderService';
import ContactInfoDetailDialog from './ContactInfoDetailDialog';
import OrderDetailDialog from './OrderDetailDialog';
import PaymentDetailDialog from './PaymentDetailDialog';

export default function Orders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParams = parseInt(searchParams.get('page') || 1);
  const keywordsParams = searchParams.get('keywords');
  const sortByParams = searchParams.get('sortBy');


  // Các state params
  const [keywords, setKeywords] = React.useState(keywordsParams || '');

  // handle fetch data
  const [orderData, setOrderData] = React.useState({ orders: [], totalPages: 0 });
  React.useEffect(() => {
    const fetchOrders = async () => {
      const data = await OrderService.getPaginatedAllOrders(pageParams, 10, keywordsParams, sortByParams);
      setOrderData(data);
    };
    fetchOrders();
  }, [pageParams, keywordsParams, sortByParams])

  const handleNavigate = (params) => {
    !params.page && pageParams && (params.page = pageParams)
    !params.keywords && keywordsParams && (params.keywords = keywordsParams)
    !params.sortBy && sortByParams && (params.sortBy = sortByParams);
    params.keywords === 'all' && delete params.keywords
    params.sortBy === 'all' && delete params.sortBy
    params.sortBy === sortByParams && delete params.sortBy
    navigate({
      pathname: '/manage-profit',
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

  const handleSortOrder = (sortByValue) => {
    const params = {
      sortBy: sortByValue
    }
    handleNavigate(params);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <TextField required value={keywords} onChange={(e) => setKeywords(e.target.value)} size="small" fullWidth id="outlined-basic" label="Tìm kiếm số điện thoại" variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSearchByKeywords} variant="contained" endIcon={<SearchIcon />}>
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
      {
        orderData?.orders && (
          <Grid item>
            <Typography color="error" variant="caption" display="block" gutterBottom>
              Thành lập {orderData?.totalOrders} Các hơn hàng
            </Typography>
          </Grid>
        )
      }
      <Grid item xs={12}>
        <Title>Xem đơn hàng</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortOrder("order-id")} >ID Đơn hàng</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortOrder("name")} >Tên</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortOrder("phone")} >Số điện thoại</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortOrder("totalPrice")} >Tổng giá</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortOrder("orderStatus")} >Trạng thái đơn hàng</Typography></TableCell>
              <TableCell ><Typography color="primary">Hành động</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData?.orders?.map((order) => (
              <TableRow style={{ cursor: 'pointer' }} key={order._id}>
                <TableCell>{order?._id}</TableCell>
                <TableCell>{order?.contactInfo?.name}</TableCell>
                <TableCell>{order?.contactInfo?.phone}</TableCell>
                <TableCell>{order?.totalPrice}</TableCell>
                <TableCell>{order?.orderStatus}</TableCell>
                <TableCell >
                  <PaymentDetailDialog order={order}></PaymentDetailDialog>
                  <ContactInfoDetailDialog user={order?.userId} contactInfo={order?.contactInfo}> </ContactInfoDetailDialog>
                  <OrderDetailDialog order={order}></OrderDetailDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            page={parseInt(searchParams.get('page')) || 1}
            count={orderData.totalPages}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </Stack>
      </Grid>
    </React.Fragment >
  );
}
