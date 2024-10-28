const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/generateToken');
const RESPONSE_TEXT = require('../data/responseText');

const loginUser = async (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { identifier, password } = req.body;

        // check if all fields are present and not null
        if(!identifier || !password) {
            return next(new CustomError(400, RESPONSE_TEXT.LOGIN_MISSING_CREDENTIALS));
        }
        // check if identifier is email
        const isEmail = /\S+@\S+\.\S+/.test(identifier);

        // Find user by identifier
        let user;
        if(isEmail) {
            user = await User.findOne({ email: identifier });
        } else {
            user = await User.findOne({ username: identifier });
        }
        // If user not found, throw custom error
        if(!user) {
            return next(new CustomError(404, RESPONSE_TEXT.USER_NOT_FOUND));
        }

        // verify passwords match
        const isMatch = await user.confirmPassword(password);
        if(!isMatch) {
            return next(new CustomError(401, RESPONSE_TEXT.INVALID_CREDENTIALS));
        }

        // generate JWT token
        const token = generateToken(
            user._id, // user id
            '1hr' // expiration time
        );

        // success response
        res.status(200).json({
            success: true,
            message: RESPONSE_TEXT.LOGIN_SUCCESS,
            token, // return token in response
            user: { // return user object in response
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        });
    } catch(error) {
        next(error)
    }
}

const signupUser = async (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fName, lName, username, email, password } = req.body;
        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if(existingUser) {
            return next(new CustomError(409, RESPONSE_TEXT.USER_ALREADY_EXISTS));
        }
        // create new user
        const user = await User.create({
            firstName: fName,
            lastName: lName,
            username: username,
            email: email,
            password: password
        });

        // generate token so user can login on signup
        const token = generateToken(
            user._id, // user id
            '1h' // expiry time
        ); 

        // success response
        res.status(200).json({
            success: true,
            message: RESPONSE_TEXT.SIGNUP_SUCCESS,
            token, // return token in response object
            user: { // return user object in response object
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch(error) {
        next(error)
    }
}

module.exports = {
    loginUser,
    signupUser
}