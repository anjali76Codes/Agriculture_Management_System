const Crop = require('../models/cropModel');

// Import Gemini API setup
const { runGeminiChat } = require('../utils/GeminiApi');

// Upload crop image and get guidance for the next stages
exports.uploadCrop = async (req, res) => {
  try {
    // Store crop with image and stage
    const newCrop = new Crop({
      name: req.body.name,
      stage: req.body.stage,  // Add stage here
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    
    await newCrop.save();

    // Generate guidance for the next stages using Gemini API
    const prompt = `
      Crop Name: ${req.body.name}
      Growth Stage: ${req.body.stage}
      Please provide guidance for the subsequent stages of crop growth, including:
      - Important management practices (e.g., irrigation, fertilization, pest control)
      - Expected growth patterns and timelines
      - Indicators of healthy growth and potential problems
      - Tips for maximizing yield and quality
    `;
    const guidance = await runGeminiChat(prompt);  // Call the Gemini API to get the next stage guidance

    res.status(201).json({ 
      message: 'Image and stage uploaded successfully!', 
      guidance: guidance  // Send guidance to the frontend
    });
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
