import React, { createContext, useContext, useState, useEffect } from 'react';

const ToolContext = createContext();

export const useTool = () => useContext(ToolContext);

const DRAWING_TOOL_OPTIONS = ['pen', 'rectangle', 'line', 'eraser'];

export const ToolProvider = ({ children }) => {
    const [drawingTool, setDrawingTool] = useState('pen');
    const [lineSize, setLineSize] = useState(6); // Default line size is 6px
    const [fillColor, setFillColor] = useState('#ff0000'); // Default color is red
    const [strokeColor, setStrokeColor] = useState('#000000'); // Default color is black

    const lineSizes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

    const handleSelectLineSize = (e) => {
        setLineSize(e.target.value);
    }

    const handleChangeTool = (newValue) => {
        if(DRAWING_TOOL_OPTIONS.includes(newValue)) {
            console.log(`Selected tool: ${newValue}`);
            setDrawingTool(newValue);
        }
    }

    const handleFillColor = (newValue) => {
        setFillColor(newValue);
    };
    const handleStrokeColor = (newValue) => {
        setStrokeColor(newValue);
    };

    return (
        <ToolContext.Provider value={{ 
            drawingTool, lineSize, lineSizes, fillColor, strokeColor,
            handleChangeTool, handleSelectLineSize, handleFillColor, handleStrokeColor 
        }}>
            {children}
        </ToolContext.Provider>
    );
}