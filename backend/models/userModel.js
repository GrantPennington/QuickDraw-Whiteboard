const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

UserSchema.methods.confirmPassword = async function(password) {
    const comparing = await bcrypt.compare(password, this.password);
    return comparing;
};

UserSchema.pre('save', async function(next) {
    if(!this.isModified()) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = model('User', UserSchema);
module.exports = User;