let express = require('express');
const teacherRouter = express.Router();
const Profile = require('../viewOwnprofile/profile');
const { auth, isadmin } = require('../middlewares/auth.middleware');
const { register, login, logout } = require('../authentication/loginsignup.authentication');
const {
  viewpendingleaves,
  updatependingleave,
  deletestudents,
} = require('../controller/teacher.controller');
const {
  createModules,
  readModules,
  updateModules,
  deleteModules,
} = require('../controller/modules.controller');

teacherRouter.post('/admin/register', register);
teacherRouter.post('/admin/login', login);
teacherRouter.get('/task/viewleave', auth, isadmin, viewpendingleaves);
teacherRouter.put('/task/updateleave/:id', auth, isadmin, updatependingleave);
teacherRouter.delete('/task/deletestudent/:id', auth, isadmin, deletestudents);
// crud module
teacherRouter.post('/task/createmodule', auth, isadmin, createModules);
teacherRouter.get('/task/viewmodule', auth, isadmin, readModules);
teacherRouter.put('/task/updatemodule/:id', auth, isadmin, updateModules);
teacherRouter.delete('/task/deletemodule/:id', auth, isadmin, deleteModules);
teacherRouter.get('/profile', auth, Profile);

module.exports = teacherRouter;
