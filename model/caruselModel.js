// models/CarouselImage.js
const mongoose = require('mongoose');

const carouselImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('carouselImage', carouselImageSchema);
