
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orders from './Orders';
import { useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import Profits from './Profits';

export default function ManageProfit() {
  const { handleSetDashboardTitle } = useOutletContext();
  handleSetDashboardTitle("Quản lý lợi nhuận");
  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box>
            <Profits />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Orders />
          </Box>
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
      </Grid >
    </>
  );
}