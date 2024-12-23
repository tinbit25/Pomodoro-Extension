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
        default: null
    },
    isVerified: {
        type: Boolean,
        default: true  // Users are automatically verified
    },
    resetPasswordToken: String,
    resetPasswordExpiredAt: Date,
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active' // Default status is active
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
