const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registered = async (password) => {
  return bcrypt.hash(password, 10);
};
const loggedin = (checkemail) => {
  return jwt.sign(
    { id: checkemail._id, email: checkemail.email },
    process.env.ACCESS_TOKEN_SECERET_KEY,
    {
      expiresIn: process.env.EXCESS_TOKEN_EXPIRE_IN,
    },
  );
};

module.exports = { loggedin, registered };
