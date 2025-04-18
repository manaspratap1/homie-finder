const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  hostelName: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  landmark: {
    type: String,
    required: true
  },

  capacity: {
    type: Number,
    required: true
  },

  rent: {
    type: Number,
    required: true
  },

  images: [String],

  description: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FLAT', flatSchema);