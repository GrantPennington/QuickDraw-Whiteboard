const express = require('express');
const { body } = require('express-validator');

// import controller functions
const { loginUser, signupUser } = require('../controllers/authController');

// initialize router
const router = express.Router();

// define routes
router.post('/login', [
    /* !! INPUT VALIDATION AND SANITATION !!*/
    // Validate identifier as either email or username
    body('identifier')
        .custom(value => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s&]+$/.test(value);
            const isUsername = /^[a-zA-Z0-9_]+$/.test(value);
            if(!isEmail && !isUsername) {
                throw new Error('Identifier must be a valid email or username');
            }
            return true;
        })
        .trim()
        .escape(),
    // Validate and sanitize password field
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .trim(), // Removes whitespace from both ends of the password
    ],
    loginUser
);

router.post('/signup', [
    /* !! INPUT VALIDATION AND SANITATION !!*/
    // Validate and sanitize the email field
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(), // sanitizes by trimming and converting to lowercase
    // Validate and sanitize password field
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .trim(), // Removes whitespace from both ends of the password
        // .matches(/\d/)
        // .withMessage('Password must contain a number')
    // Sanitize username field (e.g. prevent HTML injection attacks)
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .trim()
        .escape(),
    // Sanitize username field (e.g. prevent HTML injection attacks)
    body('fName')
        .notEmpty()
        .withMessage('First Name is required')
        .trim()
        .escape(),
    // Sanitize username field (e.g. prevent HTML injection attacks)
    body('lName')
        .notEmpty()
        .withMessage('Last Name is required')
        .trim()
        .escape(),
    ],
    signupUser
);

module.exports = router;