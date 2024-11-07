import React, { useRef, useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentRect, setCurrentRect] = useState(null); // Track current rectangle being drawn
    const [currentLine, setCurrentLine] = useState(null); // Track current line being drawn
    const [rectangles, setRectangles] = useState([]); // Store completed rectangles
    const [lines, setLines] = useState([]); // Store completed lines
    const [drawingTool, setDrawingTool] = useState('rectangle'); // Current tool (rectangle or line)
    const [penPaths, setPenPaths] = useState([]);

    const [lineSize, setLineSize] = useState(6); // Default line size is 6px
    const [fillColor, setFillColor] = useState('#ff0000'); // Default color is red
    const [strokeColor, setStrokeColor] = useState('#000000'); // Default color is black

    const lineSizes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

    const handleSelect = (e) => {
        setLineSize(e.target.value);
    }

    const startDrawing = (e) => {
        const context = canvasRef.current.getContext('2d');
        context.lineWidth = lineSize;
        context.strokeStyle = strokeColor;
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const context = canvasRef.current.getContext('2d');
        context.lineWidth = lineSize;
        context.strokeStyle = strokeColor;
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
    }

    // Event handler for mouse down
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        if (drawingTool === 'rectangle') {
            setCurrentRect({ x: startX, y: startY, width: 0, height: 0, lineSize: lineSize, fillColor: fillColor, strokeColor: strokeColor });
        } else if (drawingTool === 'line') {
            setCurrentLine({ startX, startY, endX: startX, endY: startY, lineSize: lineSize, strokeColor: strokeColor });
        } else if(drawingTool === 'pen') {
            setPenPaths((prevPaths) => [...prevPaths, [{ x: startX, y: startY, lineSize: lineSize, strokeColor: strokeColor }]]);
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
                newPaths.push([...lastPath, { x: currentX, y: currentY, lineSize: lineSize, strokeColor: strokeColor }]);
                return newPaths;
            });
        }
    };

    // Event handler for mouse up
    const handleMouseUp = (e) => {
        if (isDrawing) {
            if (drawingTool === 'rectangle' && currentRect) {
                setRectangles((prevRects) => [...prevRects, currentRect]);
                setCurrentRect(null);
            } else if (drawingTool === 'line' && currentLine) {
                setLines((prevLines) => [...prevLines, currentLine]);
                setCurrentLine(null);
            } else if(drawingTool === 'pen') {
                stopDrawing(e);
            }
            setIsDrawing(false);
        }
    };

    // Draw all shapes on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all rectangles
        rectangles.forEach(({ x, y, width, height, lineSize, fillColor, strokeColor }) => {
            context.beginPath();
            context.rect(x, y, width, height);
            context.lineWidth = lineSize;
            context.fillStyle = fillColor;
            context.fill();
            context.strokeStyle = strokeColor;
            context.stroke();
        });

        // Draw all lines
        lines.forEach(({ startX, startY, endX, endY, lineSize, strokeColor }) => {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.lineWidth = lineSize;
            context.strokeStyle = strokeColor;
            context.stroke();
        });

        // Draw all pen paths (free drawing)
        penPaths.forEach((path) => {
            context.beginPath();
            path.forEach((point, index) => {
                context.strokeStyle = point.strokeColor;
                context.lineWidth = point.lineSize;
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
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => setDrawingTool('rectangle')}>Rectangle Tool</button>
                <button onClick={() => setDrawingTool('line')}>Line Tool</button>
                <button onClick={() => setDrawingTool('pen')}>Pen Tool</button>
                <div>
                    <label style={{ fontSize: 18 }}>Fill Color: </label>
                    <ColorPicker 
                        color={fillColor}
                        setColor={setFillColor}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 18 }}>Stroke Color: </label>
                    <ColorPicker 
                        color={strokeColor}
                        setColor={setStrokeColor}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 18 }}>Line Size: </label>
                    <select name="lineSize" id="line-size" value={lineSize} onChange={handleSelect} style={{ width: 100, height: 35, fontSize: 16 }}>
                        {lineSizes.map((sz) => (
                            <option key={sz} value={sz}>{sz}px</option>
                        ))}
                    </select>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                style={{ border: '1px solid black' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
            <button onClick={resetCanvas}>Reset Canvas</button>
        </div>
    );
};

export default DrawingCanvas;
