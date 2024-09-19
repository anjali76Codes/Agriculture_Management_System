const Crop = require('../models/cropModel');
const { runGeminiChat } = require('../utils/GeminiApi');

exports.uploadCrop = async (req, res) => {
  try {
    const prompt = `
      Provide guidance on the following crop and stage:
      Crop Name: ${req.body.name}
      Growth Stage: ${req.body.stage}
      
      Please provide:
      1. From Seed, Germination, Vegetative, Flowering, Harvest;  Each stage 1 line point don't include current stage.
      2. Basic information in one point each about temperature, yield increase, duration of each stage and overall management.
    `;

    const guidance = await runGeminiChat(req.body.name, req.body.stage, prompt);

    const newCrop = new Crop({
      name: req.body.name,
      stage: req.body.stage,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      guidance: guidance,
      username: req.body.username // Store username from the request body
    });

    await newCrop.save();

    res.status(201).json({
      message: 'Image, stage, and guidance uploaded successfully!',
      crop: newCrop
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const username = req.query.username; // Get username from query parameters
    const query = username ? { username } : {}; // Filter by username if provided

    const crops = await Crop.find(query); // Fetch crops based on the query
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