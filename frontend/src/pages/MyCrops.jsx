import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/MyCrops.css'; // Ensure the path is correct

const MyCrops = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [crops, setCrops] = useState([]);
  const [preview, setPreview] = useState('');
  
  // Create a ref to access the file input
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);

    try {
      await axios.post('http://localhost:3000/api/crops/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if required
        }
      });
      alert('Image uploaded successfully!');

      // Reset input fields and preview
      setFile(null);
      setName('');
      setPreview('');

      // Clear file input manually using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refetch crops to update the list
      fetchCrops();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Fetch crops from the server
  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/crops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if required
        }
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  // Handle delete crop
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/crops/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if required
        }
      });
      alert('Crop deleted successfully!');
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  // Use useEffect to fetch crops on component mount
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
          ref={fileInputRef} // Attach ref to the file input
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        <button type="submit">Upload</button>
      </form>

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
            <h3>{crop.name}</h3>
            <img
              src={`http://localhost:3000/api/crops/${crop._id}`}
              alt={crop.name}
            />
            <button
              className="delete-button"
              onClick={() => handleDelete(crop._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCrops;
