import React, { useRef, useState, useEffect } from 'react';

const ResizableRectangleCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [rectangles, setRectangles] = useState([]); // Store completed rectangles
    const [currentRect, setCurrentRect] = useState(null); // Track current rectangle being drawn

    // Event handler for mouse down
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        // Set the initial starting position for a new rectangle
        setCurrentRect({ x: startX, y: startY, width: 0, height: 0 });
        setIsDrawing(true);
    };

    // Event handler for mouse move
    const handleMouseMove = (e) => {
        if (!isDrawing || !currentRect) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Update the width and height based on the mouse position
        setCurrentRect({
            ...currentRect,
            width: currentX - currentRect.x,
            height: currentY - currentRect.y
        });
    };

    // Event handler for mouse up
    const handleMouseUp = () => {
        if (isDrawing) {
            // Add the completed rectangle to the array of rectangles
            setRectangles([...rectangles, currentRect]);
            setCurrentRect(null); // Reset the current rectangle
            setIsDrawing(false);
        }
    };

    // Draw the rectangles on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all saved rectangles
        rectangles.forEach(({ x, y, width, height }) => {
            context.beginPath();
            context.rect(x, y, width, height);
            context.fillStyle = "rgba(0, 128, 255, 0.3)";
            context.fill();
            context.strokeStyle = "blue";
            context.stroke();
        });

        // Draw the rectangle currently being resized
        if (currentRect) {
            context.beginPath();
            context.rect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
            context.fillStyle = "rgba(0, 128, 255, 0.3)";
            context.fill();
            context.strokeStyle = "blue";
            context.stroke();
        }
    }, [rectangles, currentRect]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={500}
            style={{ border: '1px solid black' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};

export default ResizableRectangleCanvas;