const express = require('express');
const router = express.Router();
const errorHandler = require('./errorHanlder');
router.use((req, res, next) => {
  res
    .status(400)
    .json(
      new errorHandler(
        false,
        404,
        'Error processing request',
        'please enter valid route, this is invalid route',
        null,
      ),
    );
  next();
});

module.exports = router;
