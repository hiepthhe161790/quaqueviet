
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Accounts from './Accounts';
import AddAccount from './AddAccount'
import DeletedAccountsLaydout from './DeletedAccountsLaydout';
import { useOutletContext } from 'react-router-dom';

export default function ManageProduct() {
  const { handleSetDashboardTitle } = useOutletContext();
  handleSetDashboardTitle("Quản lí tài khoản");
  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Accounts />
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
        <AddAccount ></AddAccount>
        <DeletedAccountsLaydout ></DeletedAccountsLaydout>
      </Grid >

    </>
  );
}









