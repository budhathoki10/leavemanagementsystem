// const express = require('express');
// const route = express.Router();
// const userschema = require('../models/user.models');
// const bcrypt = require('bcryptjs');
// const { loggedin, registered } = require('../utils/registerLoginUtils');
// const errorHandler = require('../validations/errorHanlder');
// const { cookieOptions, cookieName } = require('../config/index.config');

// // REGISTER
// const register = async (req, res) => {
//   try {
//     const { email, password, confirm_password } = req.body;

//     if (!email.endsWith('@heraldcollege.edu.np')) {
//       return res.status(400).json(
//         new errorHandler(
//           false,
//           400,
//           'Error processing request',
//           'Please use your college email (@heraldcollege.edu.np)',
//           null
//         )
//       );
//     }

//     const checkemail = await userschema.findOne({ email });
//     console.log(checkemail)
//     if (checkemail) {
//       return res.status(400).json(
//         new errorHandler(
//           false,
//           400,
//           'Error processing request',
//           'This email is already taken',
//           null
//         )
//       );
//     }

//     if (password !== confirm_password) {
//       return res.status(400).json(
//         new errorHandler(
//           false,
//           400,
//           'Error processing request',
//           'Passwords do not match',
//           null
//         )
//       );
//     }

//     const hashedPassword = await registered(password);

//     const newuser = new userschema({
//       email,
//       password: hashedPassword,
//     });
//     await newuser.save();

//     res.status(201).json(
//       new errorHandler(
//         true,
//         201,
//         'User registered successfully',
//         null,
//         newuser
//       )
//     );
//   } catch (error) {
//     return res.status(500).json(
//       new errorHandler(
//         false,
//         500,
//         'Error processing request!!',
//         error.message,
//         null
//       )
//     );
//   }
// };

// // LOGIN
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const checkemail = await userschema.findOne({ email });
//     if (!checkemail) {
//       return res.status(401).json(
//         new errorHandler(
//           false,
//           401,
//           'Error processing request',
//           'Email not found',
//           null
//         )
//       );
//     }

//     const validpassword = await bcrypt.compare(password, checkemail.password);
//     if (!validpassword) {
//       return res.status(401).json(
//         new errorHandler(
//           false,
//           401,
//           'Error processing request',
//           'Incorrect password',
//           null
//         )
//       );
//     }

//     const token = loggedin(checkemail);

//     res.cookie(cookieName, token, {...cookieOptions, overwrite: true}).json({
//       message: 'Successfully logged in',
//       token,
//       user: {
//         id: checkemail._id,
//         email: checkemail.email,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json(
//       new errorHandler(
//         false,
//         500,
//         'Error processing request!',
//         error.message,
//         null
//       )
//     );
//   }
// };

// // LOGOUT
// const logout = (req, res) => {
//   res.clearCookie(cookieName, { ...cookieOptions, maxAge: 0 });
//   res.send(
//     new errorHandler(true, 200, 'Request processed successfully', null, 'logout')
//   );
// };

// module.exports = { register, login, logout };

const express = require('express');
const route = express.Router();
const userschema = require('../models/user.models');
const bcrypt = require('bcryptjs');
const { loggedin, registered } = require('../utils/registerLoginUtils');
const errorHandler = require('../validations/errorHanlder');
const { cookieOptions } = require('../config/index.config');
const register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    //  make a only one admin with email: registrytimetableexamination@heraldcollege.edu.np
    if (!email.endsWith('@heraldcollege.edu.np')) {
      return res
        .status(400)
        .json(
          new errorHandler(
            false,
            404,
            'Error processing request',
            'Please use your college email (@heraldcollege.edu.np)',
            null,
          ),
        );
    }
    const checkemail = await userschema.findOne({ email: email });
    if (checkemail) {
      return res
        .status(400)
        .json(
          new errorHandler(
            false,
            400,
            'Error processing request',
            'This  email is already taken',
            null,
          ),
        );
    }

    if (password !== confirm_password) {
      return res
        .status(400)
        .json(new errorHandler(false, 400, 'Error processing request', 'incorrect password', null));
    }

    // password is decrypt in like this(fcvghbklsfjddjgdnvdgbdvdgbslhhgdnehgelneohndvehekhegoe)
    // the logic is in registerd function
    const decrpypassword = await registered(password);
    // save new user
    const newuser = new userschema({
      email,
      password: decrpypassword,
    });
    await newuser.save();
    res
      .status(200)
      .json(new errorHandler(true, 200, 'Request processed successfully', null, newuser));
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request!!', error.message, null));
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if the email is present in database means is it login or not
    const checkemail = await userschema.findOne({ email });
    if (!checkemail) {
      return res
        .status(401)
        .json(
          new errorHandler(
            false,
            401,
            'Error processing request',
            'could not find this email',
            null,
          ),
        );
    }
    // checking the password that it is coreect or not
    const validpassword = await bcrypt.compare(password, checkemail.password || '');
    if (!validpassword) {
      return res
        .status(401)
        .json(new errorHandler(false, 401, 'Error processing request', 'incorrect password', null));
    }
    // login
    let token = loggedin(checkemail);
    // const isLocalhost = req.headers.origin && req.headers.origin.includes('localhost');

    // let cookieObject = {
    //   httpOnly: true,
    //   // secure: !isLocalhost,
    //   secure: false,
    //   sameSite: 'None',
    //   maxAge: 90 * 24 * 60 * 60 * 1000,
    //   path: '/',
    // };

    // res.cookie('token', token, { ...cookieObject, overwrite: true }).json({
    //   message: 'Successfully logged in',
    //   token,
    // });

    res.status(200).json({ token: token });
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request!', error.message, null));
  }
};

const logout = (req, res) => {
  // clear cookie
  res.clearCookie('token');
  res.send(new errorHandler(true, 200, 'Request processed successfully', null, 'logout'));
};

module.exports = { register, login, logout };
