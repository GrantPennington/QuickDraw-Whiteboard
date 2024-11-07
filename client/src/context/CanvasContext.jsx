import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTool } from './ToolContext';

const CanvasContext = createContext();

export const useDrawingCanvas = () => useContext(CanvasContext);

export const CanvasProvider = ({ children }) => {
    const { drawingTool, lineSize, strokeColor, fillColor } = useTool();

    const canvasRef = useRef(null);
    const shapeLayerCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentRect, setCurrentRect] = useState(null); // Track current rectangle being drawn
    const [currentLine, setCurrentLine] = useState(null); // Track current line being drawn
    const [currentPen, setCurrentPen] = useState([])
    const [elements, setElements] = useState([]);
    const [rectangles, setRectangles] = useState([]); // Store completed rectangles
    const [lines, setLines] = useState([]); // Store completed lines
    const [penPaths, setPenPaths] = useState([]);
    const [eraserPaths, setEraserPaths] = useState([]);

    const startDrawing = (e) => {
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineWidth = lineSize;
        context.strokeStyle = drawingTool==='eraser' ? 'white' : strokeColor;
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineWidth = lineSize;
        context.strokeStyle = drawingTool==='eraser' ? 'white' : strokeColor;
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const resetCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setRectangles([]);
        setCurrentRect(null);
        setLines([]);
        setCurrentLine(null);
        setPenPaths([]);
        setEraserPaths([]);
        setElements([]);
    }

    // Event handler for mouse down
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        if (drawingTool === 'rectangle') {
            setCurrentRect({ x: startX, y: startY, width: 0, height: 0, lineSize: lineSize, fillColor: fillColor, strokeColor: strokeColor, type: 'rectangle' });
        } else if (drawingTool === 'line') {
            setCurrentLine({ startX, startY, endX: startX, endY: startY, lineSize: lineSize, strokeColor: strokeColor, type: 'line' });
        } else if(drawingTool === 'pen') {
            setPenPaths((prevPaths) => [...prevPaths, [{ x: startX, y: startY, lineSize: lineSize, strokeColor: strokeColor, type: 'pen' }]]);
            //setElements((prevElements) => [...prevElements, [{ x: startX, y: startY, lineSize: lineSize, strokeColor: strokeColor, type: 'pen' }] ]);
            startDrawing(e);
        } else if(drawingTool === 'eraser') {
            setPenPaths((prevPaths) => [...prevPaths, [{ x: startX, y: startY, lineSize: lineSize, strokeColor: 'white', type: 'eraser' }]]);
            // setElements((prevElements) => [...prevElements, [{ x: startX, y: startY, lineSize: lineSize, strokeColor: strokeColor, type: 'eraser' }] ]);
            startDrawing(e);
        }
        setIsDrawing(true);
    };

    // Event handler for mouse move
    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        if (drawingTool === 'rectangle' && currentRect) {
            setCurrentRect((prevRect) => ({
                ...prevRect,
                width: currentX - prevRect.x,
                height: currentY - prevRect.y,
                lineSize: lineSize, 
                fillColor: fillColor,
                strokeColor: strokeColor
            }));
        } else if (drawingTool === 'line' && currentLine) {
            setCurrentLine((prevLine) => ({
                ...prevLine,
                endX: currentX,
                endY: currentY,
                lineSize: lineSize, 
                strokeColor: strokeColor
            }));
        } else if (drawingTool === 'pen' && penPaths.length > 0) {
            draw(e);
            // Add points to the last path for continuous drawing
            setPenPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                const lastPath = newPaths.pop();
                newPaths.push([...lastPath, { x: currentX, y: currentY, lineSize: lineSize, strokeColor: strokeColor, type: 'pen' }]);
                return newPaths;
            });
        } else if (drawingTool === 'eraser' && penPaths.length > 0) {
            draw(e);
            // Add points to the last path for continuous drawing
            setPenPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                const lastPath = newPaths.pop();
                newPaths.push([...lastPath, { x: currentX, y: currentY, lineSize: lineSize, strokeColor: 'white', type: 'eraser' }]);
                return newPaths;
            });
        }
    };

    // Event handler for mouse up
    const handleMouseUp = (e) => {
        if (isDrawing) {
            if (drawingTool === 'rectangle' && currentRect) {
                setRectangles((prevRects) => [...prevRects, currentRect]);
                setElements((prevElements) => [...prevElements, currentRect]);
                setCurrentRect(null);
            } else if (drawingTool === 'line' && currentLine) {
                setLines((prevLines) => [...prevLines, currentLine]);
                setElements((prevElements) => [...prevElements, currentLine]);
                setCurrentLine(null);
            } else if(drawingTool === 'pen') {
                stopDrawing(e);
                //setPenPaths((prevPaths) => [...prevPaths, ...currentPen ]);
                // setElements((prevElements) => [...prevElements, penPaths ]);
            } else if(drawingTool === 'eraser') {
                stopDrawing(e);
            }
            setIsDrawing(false);
        }
    };

    const exportCanvasAsImage = (fileName, format = 'png') => {
        const canvas = canvasRef.current;
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

        // Create a temporary canvas to add the white background
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Fill the background
        tempContext.fillStyle = 'white';
        tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original canvas content on top of the white background
        tempContext.drawImage(canvas, 0, 0);

        // Export the temporary canvas as an image
        const dataURL = tempCanvas.toDataURL(mimeType);

        // Create a temporary link element to initiate the download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = !fileName ? `canvas_image.${format}` : `${fileName}.${format}`; // filename with appropriate extension
        link.click();
    };

    const redraw = (ctx) => {
        // Redraw each element in the correct order
        elements.forEach(element => {
            if(element.type === 'rectangle') {
                ctx.beginPath();
                ctx.rect(element.x, element.y, element.width, element.height);
                ctx.lineWidth = element.lineSize;
                ctx.fillStyle = element.fillColor;
                ctx.fill();
                ctx.strokeStyle = element.strokeColor;
                ctx.stroke();
            } else if(element.type === 'line') {
                ctx.beginPath();
                ctx.moveTo(element.startX, element.startY);
                ctx.lineTo(element.endX, element.endY);
                ctx.lineWidth = element.lineSize;
                ctx.strokeStyle = element.strokeColor;
                ctx.stroke();
            }
        })
    };

    // Draw all shapes on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        // const shapeLayer = shapeLayerCanvasRef.current;
        // const shapeContext = shapeLayer.getContext('2d');

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        //shapeContext.clearRect(0, 0, shapeLayer.width, shapeLayer.height);

        // // Draw all rectangles
        // rectangles.forEach(({ x, y, width, height, lineSize, fillColor, strokeColor }) => {
        //     context.beginPath();
        //     context.rect(x, y, width, height);
        //     context.lineWidth = lineSize;
        //     context.fillStyle = fillColor;
        //     context.fill();
        //     context.strokeStyle = strokeColor;
        //     context.stroke();
        // });

        // // Draw all lines
        // lines.forEach(({ startX, startY, endX, endY, lineSize, strokeColor }) => {
        //     context.beginPath();
        //     context.moveTo(startX, startY);
        //     context.lineTo(endX, endY);
        //     context.lineWidth = lineSize;
        //     context.strokeStyle = strokeColor;
        //     context.stroke();
        // });
        redraw(context);

        // Draw all eraser paths (free drawing)

        // Draw all pen paths (free drawing)
        penPaths.forEach((path) => {
            context.beginPath();
            path.forEach((point, index) => {
                context.strokeStyle = point.strokeColor;
                context.lineWidth = point.lineSize;
                context.lineCap = 'round';
                if (index === 0) {
                    context.moveTo(point.x, point.y);
                } else {
                    context.lineTo(point.x, point.y);
                }
            });
            context.stroke();
        });

        // Draw the current rectangle being resized
        if (currentRect) {
            context.beginPath();
            context.rect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
            context.lineWidth = currentRect.lineSize;
            context.fillStyle = currentRect.fillColor;
            context.fill();
            context.strokeStyle = currentRect.strokeColor;
            context.stroke();
        }

        // Draw the current line being drawn
        if (currentLine) {
            context.beginPath();
            context.moveTo(currentLine.startX, currentLine.startY);
            context.lineTo(currentLine.endX, currentLine.endY);
            context.lineWidth = currentLine.lineSize;
            context.strokeStyle = currentLine.strokeColor;
            context.stroke();
        }
    }, [rectangles, lines, penPaths, currentRect, currentLine]);


    return (
        <CanvasContext.Provider value={{ canvasRef, shapeLayerCanvasRef, handleMouseDown, handleMouseUp, handleMouseMove, resetCanvas, exportCanvasAsImage }}>
            {children}
        </CanvasContext.Provider>
    );
}