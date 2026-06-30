const errorHandler = require('../validations/errorHanlder');
const leavedetail = require('../models/leaveDetail.models');
const leaveTracking = require('../models/leaveTracking.models');
const userdetail = require('../models/user.models');
const moduledetail = require('../models/module.models');
const { uploadImageToCloudinary } = require('../utils/cloudinary.utils');

const createLeave = async (req, res) => {
  try {
    const { level, leaveType, reason, leaves, week } = req.body;
    const userID = req.user?._id;

    if (!leaves) {
      return res.status(400).json(new errorHandler(false, 400, 'Leave details are required', null));
    }

    let imageData = null;
    if (req.file) {
      imageData = await uploadImageToCloudinary(req.file.buffer);
    }

    const student = await userdetail.findById(userID);
    if (!student) {
      return res.status(404).json(new errorHandler(false, 404, 'Student not found', null));
    }

    const tracking = await leaveTracking
      .findOne({ studentdetail: userID })
      .populate('moduleWiseStats.module');

    const newLeave = new leavedetail({
      studentdetail: userID,
      level,
      leaveType,
      modules: [],
      reason,
      week,
      image: req.file ? req.file.originalname : 'No image provided',
      image_data: imageData,
      status: 'pending',
      appliedDate: new Date(),
    });

    for (const leave of leaves) {
      const module = await moduledetail.findById(leave.moduledetails);
      if (!module) {
        return res
          .status(404)
          .json(new errorHandler(false, 404, `Module ${leave.moduledetails} not found`, null));
      }

      let remainingLeave = 8;
      if (tracking) {
        const moduleStat = tracking.moduleWiseStats.find(
          (stat) => stat.module._id.toString() === leave.moduledetails.toString(),
        );
        if (moduleStat) {
          remainingLeave = moduleStat.remainingLeaves;
        }
      }
      if (remainingLeave <= 0) {
        return res
          .status(404)
          .json(
            new errorHandler(
              false,
              404,
              `you cannot take leave in this  ${leave.moduledetails} module`,
              null,
            ),
          );
      }

      newLeave.modules.push({
        moduledetails: leave.moduledetails,
        week: leave.week,
        classtype: leave.classtype,
        leaveday: Number(leave.leaveday) || 1,
        remainingLeave: remainingLeave,
      });
    }

    await newLeave.save();

    const populatedLeave = await leavedetail
      .findById(newLeave._id)
      .populate({
        path: 'studentdetail',
        select: ' studentname email  ',
        model: 'userdetails',
      })
      .populate({
        path: 'modules.moduledetails',
        select: 'Modulename',
        model: 'modules',
      });

    res
      .status(200)
      .json(
        new errorHandler(
          true,
          200,
          'Leave application submitted successfully',
          null,
          populatedLeave,
        ),
      );
  } catch (error) {
    console.error('Error creating leave:', error);
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const viewownleave = async (req, res) => {
  try {
    const userID = req.user._id;
    console.log(userID);
    const leaves = await leavedetail.find({ studentdetail: userID }).sort({ createdAt: -1 });
    res
      .status(200)
      .json(new errorHandler(true, 200, 'Request processed successfully', null, leaves));
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const filterviewownleave = async (req, res) => {
  try {
    const userID = req.user._id;
    const { status } = req.query;
    const filter = {
      studentdetail: userID,
      status: status,
    };

    if (status) {
      filter.status = status;
    }
    const leaves = await leavedetail
      .find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'modules.moduledetails', select: 'Modulename', model: 'modules' });

    if (leaves) {
      return res
        .status(200)
        .json(new errorHandler(true, 200, 'Request processed successfully', null, leaves));
    }
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const getLeaveStats = async (req, res) => {
  try {
    const userID = req.user?._id;
    const tracking = await leaveTracking
      .findOne({ studentdetail: userID })
      .populate({
        path: 'studentdetail',
        select: 'studentname email ',
        model: 'userdetails',
      })
      .populate({
        path: 'moduleWiseStats.module',
        select: 'Modulename',
        model: 'modules',
      });

    if (!tracking) {
      const student = await userdetail.findById(userID).select(' email ');
      return res.status(200).json(
        new errorHandler(true, 200, 'No leave history found', null, {
          studentdetail: student,
          totalLeaveTaken: 0,
          moduleWiseStats: [],
        }),
      );
    }

    res.status(200).json(new errorHandler(true, 200, 'Leave statistics retrieved', null, tracking));
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

module.exports = { createLeave, viewownleave, getLeaveStats, filterviewownleave };
