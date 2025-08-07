import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import SpecsDialog from './SpecsDialog';
import InStockDialog from './InStockDialog';
import DescDialog from './DescDialog'
import ImageDialog from './ImageDialog'

export default function DeletedProducts({ productData }) {
  return (
    <React.Fragment>
      <Title>Sản phẩm</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tên </TableCell>
            <TableCell>Vùng</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>CÒn hàng</TableCell>
            <TableCell>Thành phần</TableCell>
            <TableCell>Thông số</TableCell>
            <TableCell>Ảnh</TableCell>
            <TableCell>Giá bán</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productData && productData.products?.map((product, index) => (
            <TableRow style={{ cursor: 'pointer' }} key={index} >
              <TableCell>
                <React.Fragment>
                  {product?.name}
                </React.Fragment>
              </TableCell>
              <TableCell>
                <React.Fragment>
                  {product?.brand}
                </React.Fragment>
              </TableCell>
              <TableCell>
                <React.Fragment>
                  {product?.category}
                </React.Fragment>
              </TableCell>
              <TableCell>
                <React.Fragment>
                  {product?.isAvailable.toString()}
                </React.Fragment>
              </TableCell>
              <TableCell >
                <React.Fragment>
                  <DescDialog description={product?.description}></DescDialog>
                </React.Fragment>
              </TableCell>
              <TableCell >
                <React.Fragment>
                  <SpecsDialog specs={product?.specs}></SpecsDialog>
                </React.Fragment>
              </TableCell>
              <TableCell >
                <React.Fragment>
                  <ImageDialog images={product?.images}></ImageDialog>
                </React.Fragment>
              </TableCell>
              <TableCell >
                <React.Fragment>
                  <InStockDialog inStock={product?.inStock}></InStockDialog>
                </React.Fragment>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
