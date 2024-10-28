class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    
        // Ensure the error class is captured correctly in the stack traces (V8 feature)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;