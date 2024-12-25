const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure sender information
const sender = {
  address: "tinbitelias25@gmail.com", 
  name: "Tinbite",                 
};

module.exports = { sender, sgMail };
