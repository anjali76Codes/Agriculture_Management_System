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
  user: { // Add user reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this matches your user model
    required: true
  }
});

module.exports = mongoose.model('Crop', cropSchema);
