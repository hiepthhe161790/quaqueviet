import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import io from 'socket.io-client';


export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const socket = io("http://localhost:3333");

        socket.on('newOrder', (order) => {
            setNotifications((prevNotifications) => [...prevNotifications, order]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length === 0 ? (
                    <MenuItem onClick={handleClose}>Không có thông báo mới</MenuItem>
                ) : (
                    notifications.map((notification, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            <Typography variant="body2">{`You have new order from: ${notification.contactInfo.name}`}</Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </div>
    );
}
