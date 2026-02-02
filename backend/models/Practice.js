const mongoose = require('mongoose');

const PracticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true }, // Cambio: Date en lugar de String
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // Optional: Link to a specific team
  assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Optional: Individually assigned members
}, { timestamps: true });

const Practice = mongoose.model('Practice', PracticeSchema);
module.exports = Practice;
