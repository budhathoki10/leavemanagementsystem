const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();
const configureGooglePassport = require('./authentication/passportGoogle');
const teacherRouter = require('./router/teacher.route');
const studentRouter = require('./router/student.route');
let app = express();
const cookieParser = require('cookie-parser');
const handleroute = require('./validations/routeHandler.validations');
const router = require('./router/forgotPassword.route');
const cors = require('cors');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
configureGooglePassport();
app.use(passport.initialize());
const getOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
};

const allowedOrigins = new Set(
  [
    'https://leavemanagementfrontend.vercel.app',
    'https://devplat.heraldcollege.edu.np',
    'http://localhost:7500',
    'http://127.0.0.1:7500',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL && getOrigin(process.env.FRONTEND_URL),
    ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()),
  ].filter(Boolean),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('PORT:', process.env.PORT);
    app.listen(process.env.PORT, () => {
      console.log('sucessfully connected to server');
    });
    console.log('sucessfully connect to the mongodb');
  })
  .catch(() => {
    console.log('error to connect in mongodb');
  });

const mountRoutes = (basePath) => {
  app.use(basePath, teacherRouter);
  app.use(basePath, studentRouter);
  app.use(basePath, router);
};

mountRoutes('/api');
mountRoutes('/');
app.use(handleroute);
