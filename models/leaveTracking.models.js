const mongoose = require('mongoose');

const leaveTrackingSchema = new mongoose.Schema({
  studentdetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userdetails',
    required: true,
    unique: true,
  },

  totalLeaveTaken: { type: Number, default: 0 },

  moduleWiseStats: [
    {
      module: { type: mongoose.Schema.Types.ObjectId, ref: 'modules' },
      daysTaken: { type: Number, default: 0 },
      remainingLeaves: { type: Number, default: 8 },
    },
  ],

  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LeaveTracking', leaveTrackingSchema);
