const mongoose = require('mongoose');

const presidentSchema = new mongoose.Schema({
  assignedVicePresidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VicePresident' }],
  assignedLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leader' }],
});

const President = mongoose.model('President', presidentSchema);
module.exports = President;
