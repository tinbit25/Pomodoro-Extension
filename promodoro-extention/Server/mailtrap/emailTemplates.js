const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 50px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(to right, #FF5733, #FF6F61);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 36px;
      margin: 0;
    }
    .content {
      padding: 40px 20px;
      text-align: center;
    }
    .content p {
      font-size: 18px;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .check-icon {
      display: inline-block;
      background-color: #FF5733;
      color: white;
      width: 80px;
      height: 80px;
      line-height: 80px;
      border-radius: 50%;
      font-size: 40px;
      margin: 30px 0;
    }
    .footer {
      background-color: #f4f4f4;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #888;
    }
    .logo {
      margin: 20px auto;
      width: 150px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Successful</h1>
    </div>
    <div class="content">
      <p>Your password has been successfully reset. You can now use your new password to log in.</p>
      <div class="check-icon">✓</div>
      <p>If you did not request this change, please contact support immediately.</p>
      <img src="https://example.com/pomodoro-logo.png" alt="Pomodoro Extension" class="logo">
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
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
      font-family: 'Arial', sans-serif;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 50px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(to right, #FF5733, #FF6F61);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 36px;
      margin: 0;
    }
    .content {
      padding: 40px 20px;
      text-align: center;
    }
    .content p {
      font-size: 18px;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      background-color: #FF5733;
      color: white;
      text-decoration: none;
      font-size: 20px;
      padding: 15px 30px;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      background-color: #f4f4f4;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #888;
    }
    .logo {
      margin: 20px auto;
      width: 150px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="{resetURL}" class="btn">Reset Password</a>
      <p>If you didn't request this change, please ignore this email.</p>
      <img src="https://example.com/pomodoro-logo.png" alt="Pomodoro Extension" class="logo">
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;


module.exports = { PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE };
