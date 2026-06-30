const userData = require('../models/user.models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/forgetPasswordNodemailer.utils');
const errorHandler = require('../validations/errorHanlder'); // assuming same helper as module controller

// Forgot Password (Generate OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(new errorHandler(false, 404, 'Error processing request', 'Email not found', null));
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP + expiry (5min)
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const emailResponse = await sendEmail(
      email,
      'Password Reset OTP',
      `Your OTP is ${otp}. It is valid for 5 minutes.`,
    );

    if (!emailResponse.success) {
      return res
        .status(500)
        .json(
          new errorHandler(
            false,
            500,
            'Error processing request',
            'Failed to send OTP email',
            null,
          ),
        );
    }

    res.status(200).json(new errorHandler(true, 200, 'OTP sent successfully', null, { email }));
  } catch (error) {
    res.status(500).json(new errorHandler(false, 500, 'Error generating OTP', error.message, null));
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(new errorHandler(false, 404, 'Error processing request', 'User not found', null));
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json(
          new errorHandler(false, 400, 'Error processing request', 'Invalid or expired OTP', null),
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json(new errorHandler(true, 200, 'Password reset successful', null, { email }));
  } catch (error) {
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error resetting password', error.message, null));
  }
};

module.exports = { forgotPassword, resetPassword };
