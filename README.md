# MERN Auth Boilerplate

This repository is a Node.js and Express authentication boilerplate built with a structured and modular backend setup. This project provides the essential components for setting up user authentication, including signup and login, input validation, protected routes, and security enhancements. 

## Features

- **User Authentication**: Includes routes, controllers, and models for user signup and login.
- **Validation**: Input validation using `express-validator`.
- **Security**: Uses `helmet`, `cors`, and `express-rate-limit` to set secure HTTP headers, allow cross-origin requests, and limit repeated requests.
- **Protected Routes**: `protect` middleware ensures that only authenticated users can access certain endpoints.
- **Modular Structure**: Organized file structure for easy scalability.
- **Error Handling**: Global error handling middleware for catching and managing errors.

## Folder Structure

Inside the `backend` folder:
- **config**: Contains configuration files, like the database connection function.
- **controllers**: Holds the login and signup controllers for handling authentication logic.
- **routes**: Contains routes for login and signup, with input validation.
- **models**: Includes the `UserSchema` model for handling user data with MongoDB and Mongoose.
- **middleware**: Contains middleware for error handling (`errorHandler`) and route protection (`protect`).
- **data**: Used for storing constants.
- **utils**: Holds any utility functions used across the application.

## Built With (Dependencies)

- **express**: For routing and middleware handling.
- **express-rate-limit**: To limit repeated requests for better security.
- **express-validator**: For input validation on routes.
- **nodemon**: For automatic server restarts during development.
- **mongoose**: For MongoDB object modeling.
- **mongodb**: MongoDB database.
- **jsonwebtoken**: For generating and verifying JWTs.
- **dotenv**: For environment variable management.
- **cors**: To enable cross-origin resource sharing.
- **helmet**: For setting various HTTP headers to secure the app.
- **body-parser**: For parsing incoming request bodies.
- **bcryptjs**: For hashing and comparing passwords securely.

## Getting Started

### Prerequisites

Make sure you have **Node.js** and **MongoDB** installed on your machine.

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/mern-auth-boilerplate.git

2. Navigate to the backend folder:

   ```bash
   cd mern-auth-boilerplate/backed

3. Install dependencies:

   ```bash
   npm install

### Configuration

#### Add your environment variables to the .env file:
    PORT=5000
    MONGO_URI=your-mongodb-uri
    MONGO_DATABASE_NAME=your-database-name
    MONGO_DB_USER=your-database-user (optional)
    MONGO_DB_PASS=your-database-pass (optional)
    JWT_SECRET=your-jwt-secret
    FRONTEND_CLIETN_URL=your-frontend-url

### Running the Application
1. Start the server in development mode:

    ```bash
    npm run dev
    ```

2. Start the server in production mode:

    ```bash
    npm run start
    ```

The app will run at http://localhost:5000 (PORT depends on your environment variable)

### Project Structure
```plaintext
backend/
├── config/
│   └── db.js                # Database connection function
├── controllers/
│   ├── authController.js    # Contains signup and login logic
├── routes/
│   ├── authRoutes.js        # Routes for login and signup
├── models/
│   └── User.js              # UserSchema model for MongoDB
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   ├── protect.js           # Protected route middleware
├── data/
│   └── constants.js         # Store constants used in the app
├── utils/
│   └── helpers.js           # Utility functions (if any)
├── .env                     # Environment variables file
├── index.js                 # Main server file
├── package.json             # Project metadata and dependencies
```

### API Routes
| Method | Endpoint                | Description                      |
|--------|--------------------------|----------------------------------|
| POST   | `/api/v1/auth/signup`    | Registers a new user.           |
| POST   | `/api/v1/auth/login`     | Logs in a user and returns a JWT.|


#### Middleware

  - **Error Handler:** Catches and manages errors throughout the application.
  - **Protect:** Middleware for protecting routes. Ensures routes are only accessible by authenticated users.

License

Distributed under the MIT License. See LICENSE for more information.
