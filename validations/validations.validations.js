const { body } = require('express-validator');
// just for handle errors as if some field are missing or not
const validateregister = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Please enter a password')
    .isLength({ min: 6 })
    .withMessage('Password length must be at least 6 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('weak password, use atleast one upper case and atleast one integer'),
];

const validatelogin = [
  body('email')
    .notEmpty()
    .withMessage('Please enter email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password').notEmpty().withMessage('Please enter password'),
];

module.exports = { validateregister, validatelogin };
