import React, { useState } from 'react';

const ColorPicker = ({ color, setColor, showHexCode=false }) => {
    const handleChange = (event) => {
        setColor(event.target.value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Color input field */}
            <input
                type="color" 
                value={color} 
                onChange={handleChange} 
                style={{ marginRight: '0px', width: 40, height: 40, cursor: 'pointer' }}
            />

            {/* Color preview box */}
            {/* <div 
                style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: color,
                    border: '1px solid #000',
                    borderRadius: '4px'
                }}
            ></div> */}

            {/* Display selected color code */}
            {showHexCode && <p style={{ marginLeft: '10px' }}>{color}</p>}
        </div>
    );
};

export default ColorPicker;