import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const CustomTooltip = ({ title, children }) => {
    return (
        <Tooltip title={title} placement='right'>
            {children}
        </Tooltip>
    )
}

export default CustomTooltip
