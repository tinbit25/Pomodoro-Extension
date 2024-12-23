const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./db/connectDB');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authroutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder to the build folder
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Serve index.html for any route that is not handled by the API
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
    await connectDB(); // Ensure DB is connected before accepting requests
    console.log(`Server running on port ${port}`);
});
