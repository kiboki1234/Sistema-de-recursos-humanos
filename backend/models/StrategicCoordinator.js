const mongoose = require('mongoose');

const strategicCoordinatorSchema = new mongoose.Schema({
  assignedPresidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'President' }],
  canCreateUsers: { type: Boolean, default: true },
});

const StrategicCoordinator = mongoose.model('StrategicCoordinator', strategicCoordinatorSchema);
module.exports = StrategicCoordinator;
