const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
