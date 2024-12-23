const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #FF5733, #FF6F61);
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .container {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .btn {
      background-color: #FF5733;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
    .img-center {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Verify Your Pomodoro Extension Email</h1>
  </div>
  <div class="container">
    <p>Hello,</p>
    <p>Thank you for signing up for Pomodoro Extension! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF5733;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your Pomodoro Extension Team</p>
    <img src="https://example.com/pomodoro-logo.png" alt="Pomodoro Extension" class="img-center">
  </div>
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #FF5733, #FF6F61);
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .container {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .check-icon {
      background-color: #FF5733;
      color: white;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      display: inline-block;
      font-size: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
    .img-center {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Password Reset Successful</h1>
  </div>
  <div class="container">
    <p>Hello,</p>
    <p>Your password has been successfully reset. You can now use your new password to log in.</p>
    <div style="text-align: center;">
      <span class="check-icon">✓</span>
    </div>
    <p>If you did not request this change, please contact support immediately.</p>
    <p>Best regards,<br>Your Pomodoro Extension Team</p>
    <img src="https://example.com/pomodoro-logo.png" alt="Pomodoro Extension" class="img-center">
  </div>
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #FF5733, #FF6F61);
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .container {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .btn {
      background-color: #FF5733;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
    .img-center {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Password Reset Request</h1>
  </div>
  <div class="container">
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the link below to reset it:</p>
    <p><a href="{resetURL}" class="btn">Reset Password</a></p>
    <p>If you didn't request this change, please ignore this email.</p>
    <p>Best regards,<br>Your Pomodoro Extension Team</p>
    <img src="https://example.com/pomodoro-logo.png" alt="Pomodoro Extension" class="img-center">
  </div>
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

module.exports = { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE };
