const mongoose = require('mongoose');

const vicePresidentSchema = new mongoose.Schema({
  assignedLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leader' }],
});

const VicePresident = mongoose.model('VicePresident', vicePresidentSchema);
module.exports = VicePresident;
