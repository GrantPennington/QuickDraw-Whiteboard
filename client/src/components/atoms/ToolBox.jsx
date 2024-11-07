import React from 'react'
import { Box, Paper, Typography } from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import BrushIcon from '@mui/icons-material/Brush';
import RectangleIcon from '@mui/icons-material/Rectangle';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useTool } from '../../context/ToolContext';
import CustomTooltip from '../CustomTooltip';
import { capitalizeFirstLetter } from '../../utils/index.js';

const getIcon = (tool) => {
    if(tool === 'pen') {
        return <BrushIcon sx={{ fontSize: 28 }} />
    } else if(tool === 'rectangle') {
        return <RectangleIcon sx={{ fontSize: 28 }} />
    } else if(tool === 'line') {
        return <DrawIcon sx={{ fontSize: 28 }} />
    } else if(tool === 'eraser') {
        return <AutoFixNormalIcon sx={{ fontSize: 28 }} />
    } else {
        return <TextFieldsIcon sx={{ fontSize: 28 }} />
    }
}

const ToolBox = ({ tool }) => {
    const { drawingTool, handleChangeTool } = useTool();

    const hoverColor = '#dbdbdb';
    return (
        <CustomTooltip title={`${capitalizeFirstLetter(tool)} Tool`}>
        <Paper 
            sx={{ 
                width: 40, height: 40, border: '1px solid black', backgroundColor: drawingTool===tool ? hoverColor : 'white', borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', 
                '&: hover': { cursor: 'pointer', backgroundColor: hoverColor }, boxShadow: drawingTool===tool ? '0px' : '3px 3px 3px black', mb: 1
            }}
            onClick={() => handleChangeTool(tool)}
        >
            {getIcon(tool)}
        </Paper>
        </CustomTooltip>
    )
}

export default ToolBox;
