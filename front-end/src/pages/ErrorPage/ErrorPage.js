import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const ErrorPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    const status = queryParams.get('status');
    const handleBackToHome = () => {
        window.location.href = '/';
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
        >
            <Typography variant="h4" gutterBottom>
               {status || '403'} Forbidden
            </Typography>
            <Typography variant="body1" gutterBottom>
                {message || 'You do not have permission to access this resource.'}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBackToHome}>
                Back to Home
            </Button>
        </Box>
    );
};

export default ErrorPage;
