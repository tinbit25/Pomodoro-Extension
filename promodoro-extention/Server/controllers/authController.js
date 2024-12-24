const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
const { generateTokenAndSetCookie, sendWelcomeEmail, sendPasswordResetEmail } = require('../mailtrap/emails');


// Helper function to add session history
const addSessionHistory = async (user, step) => {
    try {
        const sessionId = user.session.sessionId || crypto.randomBytes(20).toString('hex');
        user.sessionHistory.push({ step, sessionId, completedAt: Date.now() });
        await user.save();
    } catch (error) {
        console.error("Error adding session history:", error);
    }
};

// Signup function
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
            status: 'active',
        });

        await user.save();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login function (no token)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if the account is verified
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'User account is not verified' });
        }

        // Check if the user's pomodoroStatus is active (if needed)
        if (user.pomodoroStatus.status !== 'active') {
            return res.status(403).json({ success: false, message: 'User account is not active in Pomodoro' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // If everything is okay, return success
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { 
                ...user._doc, 
                password: undefined,
            },
            generateTokenAndSetCookie
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Logout function (no token-based auth)
exports.logout = async (req, res) => {
    try {
        // Here, you can log out the user by clearing cookies or session (if you're using session-based auth)
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Forgot password function
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ success: false, message: 'User account is not active' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiredAt = Date.now() + 1 * 60 * 60 * 1000;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
        // Add session history for forgot password
        await addSessionHistory(user, 'forgotPassword');

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Reset password function
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

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiredAt = undefined;

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Pomodoro status after a completed cycle
exports.updatePomodoroStatus = async (user, completionTime, focusTime, shortBreak, longBreak) => {
    try {
        user.pomodoroStatus.cycleCount += 1;
        user.pomodoroStatus.completionTime += completionTime;
        user.pomodoroStatus.focusTime += focusTime;
        user.pomodoroStatus.shortBreak += shortBreak;
        user.pomodoroStatus.longBreak += longBreak;
        user.pomodoroStatus.status = 'active';

        await user.save();
    } catch (error) {
        console.error("Error updating Pomodoro status:", error);
    }
};

// Complete Pomodoro cycle function
exports.completePomodoroCycle = async (req, res) => {
    const { userId, completionTime, focusTime, shortBreak, longBreak } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        await exports.updatePomodoroStatus(user, completionTime, focusTime, shortBreak, longBreak);

        res.status(200).json({
            success: true,
            message: 'Pomodoro cycle completed and status updated'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
