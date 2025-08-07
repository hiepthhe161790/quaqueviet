import React from 'react';
import { Box } from '@mui/material';

const ColorIndicator = ({ color }) => {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid #000',
      }}
    />
  );
};

export default ColorIndicator;
