const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  stage: {
    type: String,
    required: true,
    enum: ['Seed', 'Germination', 'Vegetative', 'Flowering', 'Harvest']
  },
  guidance: {
    type: String  // Store guidance as a string
  }
});

module.exports = mongoose.model('Crop', cropSchema);
