// OrderPagination.js
import React from 'react';
import { Stack, Pagination } from '@mui/material';

const OrderPagination = ({ currentPage, totalPages, onChangePage }) => (
  <Stack spacing={2} sx={{ mt: 3 }}>
    <Pagination
      page={currentPage}
      count={totalPages}
      onChange={onChangePage}
      showFirstButton
      showLastButton
      sx={{ display: 'flex', justifyContent: 'center' }}
    />
  </Stack>
);

export default OrderPagination;
