// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// // Change Password (After Login)
// exports.changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     const isValid = await user.comparePassword(currentPassword);
//     if (!isValid) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Password change failed', error: error.message });
//   }
// };

// // Forgot Password - Generate Reset Token
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found with this email' });
//     }

//     // Generate reset token (valid for 1 hour)
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour

//     user.resetToken = resetToken;
//     user.resetTokenExpiry = resetTokenExpiry;
//     await user.save();

//     // In production, send this via email. For now, return it in response
//     res.json({ 
//       message: 'Reset token generated',
//       resetToken, // In production, send this via email instead
//       resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to process request', error: error.message });
//   }
// };

// // Reset Password with Token
// exports.resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     // Update password
//     user.password = newPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Password reset failed', error: error.message });
//   }
// };

const User = require('../models/User');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendPasswordChangeConfirmation } = require('../services/emailService');

// Change Password (After Login)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send confirmation email
    await sendPasswordChangeConfirmation(user.email, user.name);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
};

// Forgot Password - Generate Reset Token and Send Email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.json({ 
        message: 'If an account exists with that email, you will receive a password reset link shortly.' 
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 36000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (emailResult.success) {
      res.json({ 
        message: 'Password reset link has been sent to your email. Please check your inbox.' 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
};

// Reset Password with Token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordChangeConfirmation(user.email, user.name);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};