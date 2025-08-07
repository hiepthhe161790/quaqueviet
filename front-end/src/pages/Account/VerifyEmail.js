import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthenService from '../../services/api/AuthenService';
import { Box, Typography, CircularProgress } from '@mui/material';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const otp = queryParams.get('otp');
        const email = queryParams.get('email');
        const verifyEmail = async () => {
            try {
                const response = await AuthenService.verifyEmail(otp, email);
                setMessage(response.message);
                if (response.message === 'Email verified successfully') {
                    setTimeout(() => {
                        navigate('/signin');
                    }, 5000); 
                }
            } catch (error) {
                setMessage(error.response?.data?.message || 'An error occurred during email verification.');
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            {loading ? (
                <CircularProgress />
            ) : (
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Email Verification
                    </Typography>
                    <Typography variant="body1">{message}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default VerifyEmail;
