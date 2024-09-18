const Crop = require('../models/cropModel');
const { runGeminiChat } = require('../utils/GeminiApi');

exports.uploadCrop = async (req, res) => {
  try {
    // Generate guidance for the next stages using the Gemini API
    const prompt = `
      Provide guidance on the following crop and stage:
      Crop Name: ${req.body.name}
      Growth Stage: ${req.body.stage}

      Please provide:
      1. Important management practices for this stage (e.g., irrigation, fertilization, pest control)
      2. Expected growth patterns and timelines
      3. Indicators of healthy growth and potential problems
      4. Tips for maximizing yield and quality
    `;
    
    const guidance = await runGeminiChat(req.body.name, req.body.stage, prompt);  // Generate guidance using Gemini

    // Store crop with image, name, stage, and guidance
    const newCrop = new Crop({
      name: req.body.name,
      stage: req.body.stage,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      guidance: guidance  // Store guidance in the database
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
