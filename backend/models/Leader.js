const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({
  assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
});

const Leader = mongoose.model('Leader', leaderSchema);
module.exports = Leader;
 