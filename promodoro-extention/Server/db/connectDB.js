const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbURI = process.env.DATABASE;  
        if (!dbURI) {
            throw new Error("Database URI is not defined in the environment variables.");
        }
        await mongoose.connect(dbURI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
