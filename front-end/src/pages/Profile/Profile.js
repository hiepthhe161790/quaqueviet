import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AuthenService from '../../services/api/AuthenService';
import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';
// import AuthenService from '../../services/api/AuthenService';
// import { useSelector } from 'react-redux';
const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AuthenService.getProfile();
        setUserData(user.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  // const userData = useSelector((state) => state.orebiReducer.userInfo);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const switchToPasswordChange = () => {
    setIsChangePassword(true);
    setIsModalOpen(true);
  };

  // const switchToProfileUpdate = () => {
  //   setIsChangePassword(false);
  // };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Hồ sơ cá nhân
      </Typography>
      {userData && <UpdateProfile userData={userData} />}
      <Button onClick={switchToPasswordChange} variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
        Thay đổi mật khẩu
      </Button>

      <Dialog open={isModalOpen} onClose={toggleModal}>
        <DialogTitle>{isChangePassword ? ' Đổi mật khẩu' : 'Update Profile'}</DialogTitle>
        <DialogContent>
          {isChangePassword ? <ChangePassword /> : <UpdateProfile userData={userData} />}
        </DialogContent>
        <DialogActions>
          {isChangePassword ? (
            <>
              {/* <Button onClick={switchToProfileUpdate} color="primary">
                Update Profile
              </Button>
              <Button onClick={toggleModal} color="primary" form="changePasswordForm" type="submit">
                Change Password
              </Button> */}
            </>
          ) : (
            <>
              <Button onClick={switchToPasswordChange} color="primary">
                Thay đổi mật khẩu
              </Button>
              <Button color="primary" form="updateProfileForm" type="submit">
                Cập nhật hồ sơ
              </Button>
            </>
          )}
          <Button onClick={toggleModal} color="secondary">
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;