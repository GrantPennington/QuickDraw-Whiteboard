/**
 * Error Handler Middleware
 * Utilizes CustomError Class
 */

const CustomError = require('../utils/CustomError');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // check if error is an instance of CustomError
    if(err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    };

    // handle different environments
    if(process.env.NODE_ENV === 'development') {
        console.error(err);
        return res.status(statusCode).json({
            success: false,
            error: err,
            message: message,
        });
    }

    // for production, avoid leaking insternal error details
    res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = errorHandler;