const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/firebase');
const { sendPasswordResetEmail, sendPasswordChangeConfirmation } = require('../services/emailService');

// Change Password (After Login)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const db = getDb();
    const userDoc = await db.collection('users').doc(req.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(req.userId).update({
      password: hashedPassword,
    });

    // Send confirmation email
    await sendPasswordChangeConfirmation(userData.email, userData.name);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
};

// Forgot Password - Generate Reset Token and Send Email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const db = getDb();
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      // For security, don't reveal if email exists or not
      return res.json({
        message: 'If an account exists with that email, you will receive a password reset link shortly.'
      });
    }

    const userDoc = snapshot.docs[0];

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await db.collection('users').doc(userDoc.id).update({
      resetToken,
      resetTokenExpiry,
    });

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

    const db = getDb();
    const snapshot = await db
      .collection('users')
      .where('resetToken', '==', token)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check expiry
    if (userData.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(userDoc.id).update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    // Send confirmation email
    await sendPasswordChangeConfirmation(userData.email, userData.name);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};