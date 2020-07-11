const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  odate: {
    type: Date,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locdetail: {
    type: String,
    required: false
  },
  participant: {
    type: Number,
    required: true
  },
  isitsafe: {
    type: String,
    required: true
  },
  observe: {
    type: String,
    required: true
  },
  oremark: {
    type: String,
    required: true
  },
  risk: {
    type: String,
    required: true
  },
  conseq: {
    type: String,
    required: true
  },
  cremark: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: true
  },
  aremark: {
    type: String,
    required: false
  },
  remark: {
    type: String,
    required: false
  }
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;
