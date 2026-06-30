let express = require('express');
const studentRouter = express.Router();
const upload = require('../services/multer.config');
const { auth, isadmin } = require('../middlewares/auth.middleware');
const {
  createLeave,
  viewownleave,
  getLeaveStats,
  filterviewownleave,
} = require('../controller/student.controller');
const { register, login, logout } = require('../authentication/loginsignup.authentication');
const { validateregister, validatelogin } = require('../validations/validations.validations');
const handleValidationErrors = require('../validations/handle.validations');
const loginWithMicrosoft = require('../authentication/loginWithMicrosoft');
const Profile = require('../viewOwnprofile/profile');

studentRouter.post('/user/register', validateregister, handleValidationErrors, register);
studentRouter.post('/user/login', validatelogin, handleValidationErrors, login);
studentRouter.post('/user/logout', logout);
studentRouter.post('/loginwithmicrosoft', loginWithMicrosoft);
studentRouter.get('/user/dashboard', auth, getLeaveStats);
studentRouter.get('/task/viewownleave', auth, viewownleave);
studentRouter.get('/task/filterviewownleave', auth, filterviewownleave);

studentRouter.get('/profile', auth, Profile);
// upload the file with key file. single helps to post only one image only

studentRouter.post(
  '/task/create',
  auth,
  upload.single('myfile'),
  handleValidationErrors,
  createLeave,
);

module.exports = studentRouter;
