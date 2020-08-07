const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bountySchema = new Schema({
  id: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
});

module.exports = Bounty = mongoose.model('Bounty', bountySchema);