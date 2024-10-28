const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, expiry) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'd21gdiushgqodcjk';
    let exp = expiry || '1h'; 

    const token = jwt.sign(
        { id: userId }, // payload
        JWT_SECRET, // secret key
        { expiresIn: exp }
    );

    return token;
}

module.exports = generateToken;