const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  token_expire: {
    type: Number,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  refresh_token_expire: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Token = mongoose.model('Token', tokenSchema);