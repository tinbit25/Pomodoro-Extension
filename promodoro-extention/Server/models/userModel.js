const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        maxlength: [30, "Name must be less than or equal to 30 characters"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [6, "Password must have at least 6 characters"]
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: true  // No verification needed, so users are automatically verified
    },
    resetPasswordToken: String,
    resetPasswordExpiredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
