const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
const { sendWelcomeEmail, sendPasswordResetEmail,sendResetSuccessEmail } = require('../mailtrap/emails');



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

        // Send welcome email after user is created
        await sendWelcomeEmail(user.email);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


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

       
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'User  account is not verified' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

       
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { 
                ...user._doc, 
                password: undefined, 
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout function (no token-based auth)
exports.logout = async (req, res) => {
    try {
      
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Forgot password function
exports.forgotPassword=async(req,res)=>{
    const {email}=req.body
     try {
         const user=await User.findOne({email})
         if (!user) {
             return res.status(400).json({
                 success: false,
                 message: "User not found"
             });
         }
 
 //Gnerate reset token
 const resetToken=crypto.randomBytes(20).toString('hex')
     const resetTokenExpiredAt=Date.now()+1*60*60*1000;
    user.resetPasswordToken=resetToken
    user.resetPasswordExpiredAt=resetTokenExpiredAt
    await user.save()
 
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({
     success: true,
     message: "password reset link sent to your email"
 });
     } catch (error) {
         console.log("Error in forgot Password",error)
         res.status(400).json({
             success: false,
             message: error.message
         });    
     }
 }
 
 exports.resetPassword = async (req, res) => {
     try {
       const { token } = req.params; 
       const { password } = req.body; 
   
       
       const user = await User.findOne({
         resetPasswordToken: token,
         resetPasswordExpiredAt: { $gt: Date.now() }, 
       });
   
       
       if (!user) {
         return res.status(400).json({
           success: false,
           message: "Invalid or expired reset token",
         });
       }
   
     
       const hashedPassword = await bcryptjs.hash(password, 10);
       
       
       user.password = hashedPassword;
       user.resetPasswordToken = undefined;
       user.resetPasswordExpiredAt = undefined;
   
       
       await user.save();
   
       await sendResetSuccessEmail(user.email);
 
       res.status(200).json({
         success: true,
         message: "Password reset successfully",
       });
     } catch (error) {
       
       console.log("Error in resetPassword:", error.message);
   
     
       res.status(400).json({
         success: false,
         message: error.message,
       });
     }
   };
