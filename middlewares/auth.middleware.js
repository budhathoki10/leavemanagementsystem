const jwt = require('jsonwebtoken');
require('dotenv').config();
const userdetails = require('../models/user.models');
const errorHandler = require('../validations/errorHanlder');
const { cookieName } = require('../config/index.config');

const auth = async (req, res, next) => {
  try {
    // get token from cookie or header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json(
          new errorHandler(
            false,
            401,
            'Error processing request',
            'Unauthorized, Token not found',
            null,
          ),
        );
    }

    // verify the token
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECERET_KEY);
    console.log(verify);
    if (!verify) {
      return res
        .status(401)
        .json(new errorHandler(false, 401, 'Error processing request', 'Invalid token', null));
    }

    // check user exists
    const userData = await userdetails.findById(verify?.id);
    if (!userData) {
      return res
        .status(404)
        .json(new errorHandler(false, 404, 'Error processing request', 'Cannot find user', null));
    }

    req.user = userData;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

// check if admin
const isadmin = (req, res, next) => {
  if (req.user?.email !== process.env.ADMIN_COLLEGE_EMAIL) {
    return res
      .status(403)
      .json(new errorHandler(false, 403, 'Error processing request', 'Admin access only', null));
  }
  next();
};

module.exports = { auth, isadmin };
