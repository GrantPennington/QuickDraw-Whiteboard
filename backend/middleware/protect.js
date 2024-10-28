const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

// JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
const protect = (req, res, next) => {
    let token;

    // Check if token is provided in Authorization header (Bearer token)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    }

    // If no token is provided, throw custom error
    if(!token) {
        return next(new CustomError(401, 'Not authorized, token missing.'));
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded token data to the request (e.g., user ID)
        next();
    } catch(error) {
        return next(new CustomError(401, 'Not authorized, token invalid.'));
    }
}

module.exports = protect;