import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  '& > *': {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const FilterTextField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const OrderFilter = ({ startDate, endDate, setStartDate, setEndDate, fetchOrders, orderStatuses, selectedStatus, setSelectedStatus }) => {
  return (
    <FilterContainer>
      <ButtonContainer>
        {orderStatuses.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </Button>
        ))}
      </ButtonContainer>
      <Box>
        <FilterTextField
          label="Ngày bắt đầu"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FilterTextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        {/* <Button variant="contained" color="primary" onClick={fetchOrders}>
          Apply Filters
        </Button> */}
      </Box>
    </FilterContainer>
  );
};

export default OrderFilter;
