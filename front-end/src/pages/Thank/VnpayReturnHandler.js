import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/api/OrderService';
import { Typography } from '@mui/material';
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/orebiSlice";
const VnpayReturnHandler = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const handleVnpayReturn = async () => {
            const queryParams = window.location.search.substring(1); // Get the query string without the leading '?'
            try {
                const response = await OrderService.vnpayReturnUrl(queryParams);

                if (response === 'Payment successful') {
                    alert('Payment successful!');
                    dispatch(resetCart());
                    // Redirect to the order details page or any other page
                    navigate('/order-history');
                } else {
                    alert('Payment failed!');
                }
            } catch (error) {
                console.error('Error handling VNPay return:', error);
                alert('An error occurred while processing your payment.');
            }
        };

        handleVnpayReturn();
    }, [navigate]);

    return (
        <div>
            <Typography variant="h1" align="center">
                Processing Payment...
            </Typography>

        </div>
    );
};

export default VnpayReturnHandler;
