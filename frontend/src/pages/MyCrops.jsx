import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../styles/MyCrops.css'; // Ensure the path is correct

const MyCrops = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [stage, setStage] = useState('');
  const [crops, setCrops] = useState([]);
  const [preview, setPreview] = useState('');
  const [guidance, setGuidance] = useState([]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleStageChange = (e) => {
    setStage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stage || !name) {
      alert(t('myCrops.provideDetails'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('stage', stage);

    // Get username from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.username) {
      formData.append('username', userInfo.username);
    } else {
      alert(t('myCrops.userNotAuthenticated'));
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/crops/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const guidance = response.data.guidance; // Access guidance from response
      if (guidance) {
        // Split guidance into an array of points
        const guidancePoints = guidance.split('\n\n').map(point => point.trim());
        setGuidance(guidancePoints.length > 0 ? guidancePoints : [t('myCrops.noGuidance')]);
      } else {
        setGuidance([t('myCrops.noGuidance')]); // Set to default message if guidance is undefined
      }

      alert(t('myCrops.uploadSuccess'));

      setFile(null);
      setName('');
      setStage('');
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      fetchCrops(); // Refresh the list of crops
    } catch (error) {
      console.error('Error uploading image and stage:', error);
      alert(t('myCrops.uploadError'));
    }
  };


  const fetchCrops = async () => {
    try {
      // Get username from local storage for filtering
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const username = userInfo ? userInfo.username : '';

      const response = await axios.get('http://localhost:3000/api/crops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          username // Pass username as a query parameter
        }
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/crops/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert(t('myCrops.deleteSuccess'));
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className="my-crops-container">
      <h1>{t('myCrops.uploadCropTitle')}</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder={t('myCrops.cropNamePlaceholder')}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        <select value={stage} onChange={handleStageChange} required className='croptype'>
          <option value="" className='opt'>Select Crop Stage</option>
          <option value="Seed" className='opt'>Seed</option>
          <option value="Germination" className='opt'>Germination</option>
          <option value="Vegetative" className='opt'>Vegetative</option>
          <option value="Flowering" className='opt'>Flowering</option>
          <option value="Harvest" className='opt'>Harvest</option>
        </select>
        <button type="submit">{t('myCrops.uploadButton')}</button>
      </form>

      {preview && (
        <div className="image-preview">
          <h3>{t('myCrops.imagePreviewTitle')}</h3>
          <img src={preview} alt="Preview" />
        </div>
      )}

      <h2>{t('myCrops.uploadedCropsTitle')}</h2>
      <div className="uploaded-crops">
        {crops.map((crop) => (
          <div key={crop._id} className="crop-item">
            <h3>{crop.name} - {t('myCrops.stageLabel')}: {crop.stage}</h3>
            <img
              src={`http://localhost:3000/api/crops/${crop._id}`}
              alt={crop.name}
            />
            <p>Guidance: {crop.guidance || t('myCrops.noGuidance')}</p> {/* Display guidance */}
            <button
              className="delete-button"
              onClick={() => handleDelete(crop._id)}
            >
              {t('myCrops.deleteButton')}
            </button>
          </div>
        ))}
      </div>

      {guidance.length > 0 && (
        <div className="guidance-section">
          <h3>{t('myCrops.guidanceTitle')}</h3>
          <div className="guidance-cards">
            {guidance.map((point, index) => (
              <div key={index} className="guidance-card">
                <h4>{t(`myCrops.guidancePoint${index + 1}`)}</h4>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCrops;