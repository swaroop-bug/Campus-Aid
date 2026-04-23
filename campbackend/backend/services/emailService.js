const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔒 Password Reset Request - Campus Aid',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Campus Aid</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>We received a request to reset your password for your Campus Aid account.</p>
            <p>Click the button below to reset your password:</p>
            <center>
              <a href="${resetLink}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If you're having trouble clicking the button, copy and paste the URL into your web browser.</p>
            <p>Best regards,<br>Campus Aid Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; 2025 Campus Aid. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Campus Aid - Password Reset Request
      
      Hello!
      
      We received a request to reset your password for your Campus Aid account.
      
      Click the link below to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      Campus Aid Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send password change confirmation email
const sendPasswordChangeConfirmation = async (email, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Password Changed Successfully - Campus Aid',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Campus Aid</h1>
            <p>Password Changed Successfully</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <div class="success">
              <strong>✅ Your password has been changed successfully!</strong>
            </div>
            <p>Your Campus Aid account password was just changed.</p>
            <p>If you made this change, you can safely ignore this email.</p>
            <p><strong>If you didn't make this change:</strong></p>
            <ul>
              <li>Your account may be compromised</li>
              <li>Please reset your password immediately</li>
              <li>Contact support if you need assistance</li>
            </ul>
            <p>Best regards,<br>Campus Aid Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Campus Aid - Password Changed Successfully
      
      Hello ${userName}!
      
      Your Campus Aid account password was just changed.
      
      If you made this change, you can safely ignore this email.
      
      If you didn't make this change, your account may be compromised. 
      Please reset your password immediately.
      
      Best regards,
      Campus Aid Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation
};