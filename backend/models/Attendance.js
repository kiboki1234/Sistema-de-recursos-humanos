const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  practice: { type: mongoose.Schema.Types.ObjectId, ref: 'Practice', required: true },
  attended: { type: Boolean, required: true, default: false },
  checkInTime: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
