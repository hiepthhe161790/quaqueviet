import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AuthenService from '../../services/api/AuthenService';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const passwordData = {
        oldPassword: currentPassword,
        newPassword: newPassword
      };
      await AuthenService.changePassword(passwordData);
      toast.success('Mật khẩu đã được thay đổi thành công!');
    } catch (error) {
      toast.error('Có lỗi khi thay đổi mật khẩu!');
    }
  };

  return (
    <Box>
      <form onSubmit={handlePasswordSubmit}>
        <TextField
          label=" Mật khẩu hiện tại"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Thay đổi mật khẩu
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
