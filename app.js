const express = require('express');
const mongoose = require('mongoose');
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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:7500',
  'http://localhost:7501',
  'https://devplat.heraldcollege.edu.np', // This is correct
  'http://192.168.0.100:7500',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // This is correct and essential
  }),
);

require('dotenv').config();
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

app.use('/api', teacherRouter);
app.use('/api', studentRouter);
app.use('/api', router);
app.use(handleroute);
