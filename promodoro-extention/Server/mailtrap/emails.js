const { sender, sgMail } = require('./mailtra.config');
const { PASSWORD_RESET_SUCCESS_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE } = require("./emailTemplates");


const sendWelcomeEmail = async (email,name) => {
  try {
    console.log("Sending welcome email to:", email);

    const msg = {
      to: email,
      from: sender.address,
      subject: "Welcome to Our Service",
      html: ` 
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #007bff;
            color: white;
            padding: 10px 0;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome, ${name}!</h1>
          </div>
          <p>Thank you for registering with us! We are excited to have you on board.</p>
          <p>If you have any questions, feel free to reach out to us anytime.</p>
          <div class="footer">
            <p>Best Regards,</p>
            <p>Your Company Name</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    const response = await sgMail.send(msg);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    console.log("Sending password reset email to:", email); // Add more logs for debugging
    const msg = {
      to: email,
      from: sender.address,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };
    const response = await sgMail.send(msg);
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    console.log("Sending password reset success email to:", email);

    const msg = {
      to: email,
      from: sender.address,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

    const response = await sgMail.send(msg);
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email to ${email}:`, error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};

module.exports = {
 
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
