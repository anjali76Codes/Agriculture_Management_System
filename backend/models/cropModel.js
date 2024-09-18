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
  stage: {  // Add stage field
    type: String,
    required: true,
    enum: ['Seed', 'Germination', 'Vegetative', 'Flowering', 'Harvest']  // Define valid stages
  }
});

module.exports = mongoose.model('Crop', cropSchema);
