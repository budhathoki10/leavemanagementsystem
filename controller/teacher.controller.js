const leavedetail = require('../models/leaveDetail.models');
const leaveTracking = require('../models/leaveTracking.models');
const user = require('../models/user.models');
const sendMail = require('../utils/nodemailer.utils');
const errorHandler = require('../validations/errorHanlder');

const viewpendingleaves = async (req, res) => {
  const { status, level } = req.query;
  try {
    const filter = { status: status || 'pending' };
    if (status) {
      filter.status = status;
    }
    if (level) {
      filter.level = level;
    }
    const views = await leavedetail
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('studentdetail', 'studentname email')
      .populate({
        path: 'modules.moduledetails',
        select: 'Modulename',
        model: 'modules',
      });
    if (views) {
      return res
        .status(200)
        .json(new errorHandler(true, 200, 'Request processed successfully', null, views));
    }
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const updatependingleave = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const leaveApp = await leavedetail
    .findById(id)
    .populate({
      path: 'studentdetail',
      select: ' studentname email  ',
      model: 'userdetails',
    })
    .populate('modules.moduledetails');

  if (!leaveApp) {
    return res.status(404).json(new errorHandler(false, 404, 'Leave application not found', null));
  }

  if (leaveApp.status === 'approve') {
    return res
      .status(400)
      .json(new errorHandler(false, 400, 'This leave is already approved', null));
  }

  leaveApp.status = status;
  leaveApp.reviewby = process.env.ADMIN_COLLEGE_EMAIL;

  if (status === 'approve') {
    const totalDays = leaveApp.modules.reduce((sum, module) => sum + module.leaveday, 0);

    let tracking = await leaveTracking.findOne({ studentdetail: leaveApp.studentdetail._id });

    if (!tracking) {
      tracking = new leaveTracking({
        studentdetail: leaveApp.studentdetail._id,
        level: leaveApp.level,
        totalLeaveTaken: totalDays,
        moduleWiseStats: [],
      });
    } else {
      tracking.totalLeaveTaken += totalDays;
    }

    leaveApp.modules.forEach((module) => {
      const existingModule = tracking.moduleWiseStats.find(
        (stat) => stat.module.toString() === module.moduledetails._id.toString(),
      );

      if (existingModule) {
        existingModule.daysTaken += module.leaveday;
        existingModule.remainingLeaves -= module.leaveday;
      } else {
        tracking.moduleWiseStats.push({
          module: module.moduledetails._id,
          daysTaken: module.leaveday,
          remainingLeaves: 8 - module.leaveday,
        });
      }
    });

    await tracking.save();
  }

  await leaveApp.save();
  await sendMail(leaveApp);

  res
    .status(200)
    .json(
      new errorHandler(
        true,
        200,
        'Leave processed successfully',
        null,
        `Email sent to ${leaveApp.studentdetail.studentname}`,
      ),
    );
};

const deletestudents = async (req, res) => {
  try {
    const id = req.params.id;

    const leaveToDelete = await leavedetail.findById(id);

    if (!leaveToDelete) {
      return res
        .status(404)
        .json(
          new errorHandler(
            false,
            404,
            'Error processing request',
            'Cannot find this leave id',
            null,
          ),
        );
    }

    if (leaveToDelete.status === 'approve') {
      const tracking = await leaveTracking.findOne({ studentdetail: leaveToDelete.studentdetail });

      if (tracking) {
        const totalDays = leaveToDelete.modules.reduce((sum, m) => sum + m.leaveday, 0);
        tracking.totalDaysTaken -= totalDays;

        leaveToDelete.modules.forEach((module) => {
          const moduleStat = tracking.moduleWiseStats.find(
            (stat) => stat.module.toString() === module.moduledetails.toString(),
          );

          if (moduleStat) {
            moduleStat.daysTaken -= module.leaveday;
            moduleStat.remainingLeaves += module.leaveday;

            if (moduleStat.daysTaken <= 0) {
              tracking.moduleWiseStats = tracking.moduleWiseStats.filter(
                (stat) => stat.module.toString() !== module.moduledetails.toString(),
              );
            }
          }
        });

        if (tracking.totalDaysTaken <= 0) {
          await leaveTracking.findByIdAndDelete(tracking._id);
        } else {
          await tracking.save();
        }
      }
    }

    const deletedLeave = await leavedetail.findByIdAndDelete(id);

    res
      .status(200)
      .json(new errorHandler(true, 200, 'Leave deleted successfully', null, deletedLeave));
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

module.exports = { viewpendingleaves, updatependingleave, deletestudents };
