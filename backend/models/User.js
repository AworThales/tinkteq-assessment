const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: [true, 'Please enter your username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be at least 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    role: {
        type: String,
        enum: ["Shipper", "Carrier", "Admin"],
        require: false,
        default: "Shipper",
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

// Encrypting password before saving user to database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Only hash password if it has been modified
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Comparing user password
UserSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

// Return JWT Token
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN_TIME,
    });
}

// Generating password reset token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time (30 mins)
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    return resetToken; // Return the un-hashed token for sending to the user
}



module.exports = mongoose.model("User", UserSchema);