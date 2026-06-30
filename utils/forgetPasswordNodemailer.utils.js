const nodemailer = require('nodemailer');
require('dotenv').config();
const errorHandler = require('../validations/errorHanlder'); // optional, if you want to wrap

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      text,
    });

    // success response in standard format
    return new errorHandler(true, 200, 'Email sent successfully', null, { to, subject });
  } catch (err) {
    console.error('Error sending mail:', err.message);

    // error response in standard format
    return new errorHandler(false, 500, 'Error processing request', err.message, null);
  }
};

module.exports = sendEmail;
