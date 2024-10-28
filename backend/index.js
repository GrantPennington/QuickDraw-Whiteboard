const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
require('dotenv').config();
// import middleware
const errorHandler = require('./middleware/errorHandler');
const protect = require('./middleware/protect');
// import routes
const authRoutes = require('./routes/authRoutes');

// connect to DB
connectDB();

// initialize express app
const app = express();

if(process.env.NODE_ENV === 'production') {
    // Production-specific settings
    app.use(helmet()); // Use helmet middleware to set secure HTTP headers
    console.log('Running in production mode...');
} else {
    // Dev-specific settings
    console.log('Running in development mode...');
}

// bodyParser middleware
app.use(bodyParser.json());
// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies) to be sent across domains
}));

// define app routes
app.use('/api/v1/auth', authRoutes);
/* user protect middleware to protect routes */
/* EX: app.use('/api/v1/protected-route', protect, protectedRoutes) */

// error handler middleware
app.use(errorHandler)

// define port number
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}; URL: http://localhost:${PORT}`);
});