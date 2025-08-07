import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import ProductService from '../../../services/api/ProductService'
import SpecsDialog from './SpecsDialog';
import InStockDialog from './InStockDialog';
import DescDialog from './DescDialog'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ImageDialog from './ImageDialog';
import UpdateProduct from './UpdateProduct';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParams = parseInt(searchParams.get('page') || 1);
  const keywordsParams = searchParams.get('keywords');
  const sortByParams = searchParams.get('sortBy');


  // Các state params
  const [keywords, setKeywords] = React.useState(keywordsParams || '');

  // handle fetch data
  const [productData, setProductData] = React.useState({ products: [], totalPages: 0 });
  React.useEffect(() => {
    const fetchProducts = async () => {
      const data = await ProductService.getPaginatedProducts(pageParams, 10, keywordsParams, sortByParams);
      setProductData(data);
    };
    fetchProducts();
  }, [pageParams, keywordsParams, sortByParams])

  const handleNavigate = (params) => {
    !params.page && pageParams && (params.page = pageParams)
    !params.keywords && keywordsParams && (params.keywords = keywordsParams)
    !params.sortBy && sortByParams && (params.sortBy = sortByParams);
    params.keywords === 'all' && delete params.keywords
    params.sortBy === 'all' && delete params.sortBy
    params.sortBy === sortByParams && delete params.sortBy
    navigate({
      pathname: '/manage-product',
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

  const handleSortProduct = (sortByValue) => {
    const params = {
      sortBy: sortByValue
    }
    handleNavigate(params);
  }

  // handle xóa mềm
  const [openAskToDelete, setOpenAskToDelete] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const handleOpenAskToDelete = (productId) => {
    setSelectedProductId(productId);
    setOpenAskToDelete(true);
  };

  const handleSoftDeleteProduct = async () => {
    await ProductService.softDeleteProduct(selectedProductId);
    const data = await ProductService.getPaginatedProducts(pageParams, 10, keywordsParams, sortByParams);
    setProductData(data);
    setOpenAskToDelete(false);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <TextField required value={keywords} onChange={(e) => setKeywords(e.target.value)} size="small" fullWidth id="outlined-basic" label="Tìm kiếm" variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSearchByKeywords} variant="contained" endIcon={<SearchIcon />}>
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
      {
        productData?.products && (
          <Grid item>
            <Typography color="error" variant="caption" display="block" gutterBottom>
              Cửa Hàng có {productData?.totalProducts} sản phẩm
            </Typography>
          </Grid>
        )
      }
      <Grid item xs={12}>
        <Title>Sản Phẩm</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("name")}>Tên Sản phẩm</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("brand")}>Vùng miền</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("category")}>Danh mục</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("avaiable")}>CÒn hàng</Typography></TableCell>
              <TableCell ><Typography color="primary" >Mô tả</Typography></TableCell>
              <TableCell ><Typography color="primary" >Thông số</Typography></TableCell>
              <TableCell ><Typography color="primary" >Ảnh</Typography></TableCell>
              <TableCell ><Typography color="primary" >Giá</Typography></TableCell>
             <TableCell ><Typography color="primary" >Hành động</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData?.products?.map((product, index) => (
              <TableRow style={{ cursor: 'pointer' }} key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand?.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.isAvailable.toString()}</TableCell>
                <TableCell><DescDialog description={product.description} /></TableCell>
                <TableCell><SpecsDialog specs={product.specs} /></TableCell>
                <TableCell><ImageDialog images={product.images} /></TableCell>
                <TableCell><InStockDialog inStock={product.inStock} /></TableCell>
        
                <TableCell>
                  <Tooltip title="Update">
                    <UpdateProduct targetProduct={product}></UpdateProduct>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteIcon color="error" style={{ cursor: 'pointer' }} onClick={() => handleOpenAskToDelete(product._id)} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            page={pageParams}
            count={productData.totalPages}
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
            {"Do you want to delete this document?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Xóa bản ghi về cơ bản chỉ là xóa nhẹ. Bạn có thể xem lại các bản ghi đã xóa trong thùng rác nhưng không thể khôi phục chúng.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAskToDelete(false)}>Hủy</Button>
            <Button color='error' onClick={handleSoftDeleteProduct} autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
}
