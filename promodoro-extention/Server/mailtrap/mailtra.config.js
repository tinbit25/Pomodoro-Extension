const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure sender information
const sender = {
  address: "tinbitelias25@gmail.com", // Replace with your sender email
  name: "Tinbite",                 // Replace with your sender name
};

module.exports = { sender, sgMail };
