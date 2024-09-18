import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/MyCrops.css'; // Ensure the path is correct

const MyCrops = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [stage, setStage] = useState(''); 
  const [crops, setCrops] = useState([]);
  const [preview, setPreview] = useState('');
  const [guidance, setGuidance] = useState(''); // New state for guidance
  
  const fileInputRef = useRef(null);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle name change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle stage change
  const handleStageChange = (e) => {
    setStage(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stage || !name) {
      alert('Please provide both the crop name and stage for guidance.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('stage', stage); // Add stage to form data

    try {
      const response = await axios.post('http://localhost:3000/api/crops/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if required
        }
      });
      
      // Fetch guidance from the response (pass both crop name and stage)
      const { guidance } = response.data;
      setGuidance(guidance || 'No specific guidance available at this time for this crop and stage.');

      alert('Image and stage uploaded successfully!');
      
      // Reset form
      setFile(null);
      setName('');
      setStage('');
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Fetch updated crops list
      fetchCrops();
    } catch (error) {
      console.error('Error uploading image and stage:', error);
      alert('There was an error uploading the crop. Please try again.');
    }
  };

  // Fetch crops from the API
  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/crops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  // Handle crop deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/crops/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Crop deleted successfully!');
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  // Fetch crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className="my-crops-container">
      <h1>Upload Crop Image</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Crop Name"
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        {/* Stage dropdown */}
        <select value={stage} onChange={handleStageChange} required>
          <option value="">Select Crop Stage</option>
          <option value="Seed">Seed</option>
          <option value="Germination">Germination</option>
          <option value="Vegetative">Vegetative</option>
          <option value="Flowering">Flowering</option>
          <option value="Harvest">Harvest</option>
        </select>
        <button type="submit">Upload</button>
      </form>

      {/* Image Preview Section */}
      {preview && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" />
        </div>
      )}

      <h2>Uploaded Crops</h2>
      <div className="uploaded-crops">
        {crops.map((crop) => (
          <div key={crop._id} className="crop-item">
            <h3>{crop.name} - Stage: {crop.stage}</h3>
            <img
              src={`http://localhost:3000/api/crops/${crop._id}`}
              alt={crop.name}
            />
            <p>Guidance: {crop.guidance || 'No guidance available'}</p>  {/* Display guidance */}
            <button
              className="delete-button"
              onClick={() => handleDelete(crop._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Guidance Section */}
      {guidance && (
        <div className="guidance-section">
          <h3>Next Stage Guidance:</h3>
          <div className="guidance-cards">
            {guidance.split('\n\n').map((stage, index) => (
              <div key={index} className="guidance-card">
                <h4>{stage.split('\n')[0]}</h4>
                <p>{stage.split('\n').slice(1).join('\n')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCrops;
