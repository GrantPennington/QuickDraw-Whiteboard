const rateLimit = require('express-rate-limit');

// Define rate limit for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per `windowMs`
    message: 'Too many login attempts. Please try again later.'
});
// Define rate limit for signup route
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per `windowMs`
    message: 'Too many signup attempts. Please try again later.'
});

module.exports = {
    loginLimiter,
    signupLimiter,
};