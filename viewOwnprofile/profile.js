const userdetail = require('../models/user.models');
const errorHandler = require('../validations/errorHanlder');

const Profile = async (req, res) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res
        .status(401)
        .json(new errorHandler(true, 401, 'Unauthorized', 'User ID missing', null));
    }

    const profile = await userdetail.findById(userID);

    if (!profile) {
      return res.status(404).json(new errorHandler(true, 404, 'Not Found', 'User not found', null));
    }

    res
      .status(200)
      .json(new errorHandler(false, 200, 'Request processed successfully', null, profile));
  } catch (error) {
    console.error('Error fetching profile:', error);
    res
      .status(500)
      .json(new errorHandler(true, 500, 'Error processing request', error.message, null));
  }
};

module.exports = Profile;
