const mongoose = require('mongoose');
const { requiredString, normalType } = require('./common.schema');
let userdetail = mongoose.Schema({
  studentname: {
    ...normalType,
    default: 'john doe',
  },

  email: requiredString,
  password: {
    ...normalType,
    default: 'herald',
  },

  confirm_password: normalType,
  otp: { type: String, required: false },
  otpExpires: { type: Date, required: false },
});

module.exports = mongoose.model('userdetails', userdetail);
