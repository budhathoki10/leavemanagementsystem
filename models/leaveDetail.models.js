// models/leaveDetail.models.js
const mongoose = require('mongoose');

const leavedetail = mongoose.Schema(
  {
    studentdetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userdetails',
    },
    level: {
      type: Number,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    modules: [
      {
        moduledetails: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'modules',
        },
        week: {
          type: Number,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          required: true,
        },
        classtype: {
          type: String,
          enum: ['tutorial', 'workshop', 'lecture'],
          required: true,
        },
        leaveday: {
          type: Number,
          default: 1,
        },
        // REMOVE remainingLeave - it's tracked in leaveTracking
      },
    ],
    // REMOVE totalleavetaken - it's tracked in leaveTracking
    reason: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    image_data: {
      type: {
        secure_url: String,
        public_id: String,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approve', 'reject'],
      default: 'pending',
    },
    reviewby: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('leaveinformations', leavedetail);
