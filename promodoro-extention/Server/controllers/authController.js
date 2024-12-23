const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');
const User = require('../models/userModel');
const bcryptjs = require('bcrypt');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mailtrap/emails');

// User signup (no verification step)
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: true // Skip verification process, automatically verified
        });

        await user.save();
        generateTokenAndSetCookie(res, user._id);

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Email verification (skipped, as verification is bypassed)
exports.verifyEmail = async (req, res) => {
    return res.status(400).json({
        success: false,
        message: "Email verification is not required for this process."
    });
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !await bcryptjs.compare(password, user.password)) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// User logout
exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiredAt = resetTokenExpiredAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Reset password
// Reset password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiredAt: { $gt: Date.now() },  // Ensure token is still valid
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }
  
      // Hash the new password before saving it
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiredAt = undefined;
  
      await user.save();
      await sendResetSuccessEmail(user.email);  // Send reset success email
  
      res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
// Check authentication
exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
