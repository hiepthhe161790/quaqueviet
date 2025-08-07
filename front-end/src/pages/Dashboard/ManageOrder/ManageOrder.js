import { useOutletContext } from 'react-router-dom';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orders from './Orders';
import NotificationBell from './NotificationBell';


export default function ManageOrder() {
  const { handleSetDashboardTitle } = useOutletContext();
  React.useEffect(() => {
    handleSetDashboardTitle("Quản lý đơn hàng");
  }, [handleSetDashboardTitle])

  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <NotificationBell /> 
          <Orders />
        </Paper>
      </Grid>
      <Grid item xs={12} sx={{
        position: 'fixed',
        bottom: 16,
        right: 30,
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
      }}>
        {/* <AddOrder ></AddOrder>
        <DeletedOrder></DeletedOrder> */}
      </Grid >

    </>
  );
}