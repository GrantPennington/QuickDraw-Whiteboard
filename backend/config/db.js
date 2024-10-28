const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const DB_URI = process.env.MONGO_URI; 
        const DB_NAME = process.env.MONGO_DATABASE_NAME;
        
        const keyConnection = await mongoose.connect(DB_URI, {
            dbName: DB_NAME,
        });

        console.log(`MongoDB Connected: ${keyConnection.connection.host}`);
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;