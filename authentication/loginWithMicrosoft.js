const user = require('../models/user.models');
const jwt = require('jsonwebtoken');
const { cookieOptions } = require('../config/index.config');
require('dotenv').config();

const loginWithMicrosoft = async (req, res) => {
  try {
    const { studentname, email } = req.body;

    let userData = await user.findOne({ email });

    if (!userData) {
      userData = new user({ studentname, email });
      await userData.save();
    }
    

    const token = jwt.sign(
      { id: userData._id, email: userData.email },
      process.env.ACCESS_TOKEN_SECERET_KEY,
      {
        expiresIn: process.env.EXCESS_TOKEN_EXPIRE_IN,
      },
    );

    // This detects if the request is from localhost
    // const isLocalhost = req.headers.origin && req.headers.origin.includes('localhost');
    // let cookieObject = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'None',
    //   domain: '.heraldcollege.edu.np',
    //   maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
    // };
    // if (isLocalhost) {
    //   cookieObject.domain = 'localhost';
    // }
    // res.cookie('Microsoft-token', token, cookieObject).json({
    //   message: 'Successfully logged in',
    //   user: {
    //     id: checkemail._id,
    //     email: checkemail.email,
    //   },
    // });
    // const isLocalhost = req.headers.origin && req.headers.origin.includes('localhost');

    // let cookieObject = {
    //   httpOnly: true,
    //   secure: !isLocalhost,
    //   sameSite: isLocalhost ? 'Lax' : 'None',
    //   maxAge: 90 * 24 * 60 * 60 * 1000,
    //   path: '/',
    // };

    // res.cookie('token', token, { ...cookieObject }).json({
    //   message: 'Successfully logged in',
    //   token,
    // });
    res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({
      message: 'hello kushal, Internal server error !!!',
    });
  }
};

module.exports = loginWithMicrosoft;
