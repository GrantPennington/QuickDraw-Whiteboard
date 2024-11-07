import React, { useRef, useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import { useTool } from '../context/ToolContext';
import { useDrawingCanvas } from '../context/CanvasContext';
import ToolBox from './atoms/ToolBox';
import { Box, Button, Divider, MenuItem, Select, Stack, Typography } from '@mui/material';
import ExportDialog from './ExportDialog';

const Whiteboard = () => {
    const { 
        drawingTool, 
        handleChangeTool, 
        handleSelectLineSize, 
        lineSize,
        lineSizes, 
        handleFillColor, 
        handleStrokeColor,
        fillColor,
        strokeColor,
    } = useTool();

    const { 
        canvasRef, 
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        resetCanvas,
        exportCanvasAsImage,
        shapeLayerCanvasRef,
    } = useDrawingCanvas();

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f2f2f2', borderBottomLeftRadius: '5px', borderTopLeftRadius: '5px' }}>
                <Stack direction='column' sx={{ flexGrow: 1, px: 1, py: 2 }}>
                    <Typography sx={{ fontSize: 20 }}>Tool Bar</Typography>
                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 2 }}>
                        <ToolBox 
                            tool={'pen'}
                        />
                        <ToolBox 
                            tool={'eraser'}
                        />
                        <ToolBox 
                            tool={'rectangle'}
                        />
                        <ToolBox 
                            tool={'line'}
                        />
                        <ToolBox 
                            tool={'text'}
                        />
                    </Box>

                    <Divider sx={{ mt: 1, mb: 1 }} />

                    <Box sx={{ backgroundColor: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: 16 }}>Fill</Typography>
                        <ColorPicker 
                            color={fillColor}
                            setColor={handleFillColor}
                        />
                    </Box>

                    <Box sx={{ backgroundColor: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: 16 }}>Stroke</Typography>
                        <ColorPicker 
                            color={strokeColor}
                            setColor={handleStrokeColor}
                        />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 16 }}>Stroke Size: </Typography>
                        <Select name="lineSize" id="line-size" value={lineSize} onChange={handleSelectLineSize} style={{ width: 100, height: 35, fontSize: 16 }}>
                            {lineSizes.map((sz) => (
                                <MenuItem key={sz} value={sz}>{sz}px</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <ExportDialog />
                    </Box>
                </Stack>
                
            </Box>
            <Box>
            <canvas
                id={'backgroundLayer'}
                ref={canvasRef}
                width={800}
                height={500}
                style={{ border: '1px solid black' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
            </Box>
            <button onClick={resetCanvas}>Reset Canvas</button>
        </Box> 
    );
}

export default Whiteboard;