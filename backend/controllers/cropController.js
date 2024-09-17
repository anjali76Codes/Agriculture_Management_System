const Crop = require('../models/cropModel');

// Upload crop image
exports.uploadCrop = async (req, res) => {
  try {
    const newCrop = new Crop({
      name: req.body.name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    await newCrop.save();
    res.status(201).json({ message: 'Image uploaded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific crop image
exports.getCropImage = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.contentType(crop.image.contentType);
    res.send(crop.image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a crop
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.status(200).json({ message: 'Crop deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
