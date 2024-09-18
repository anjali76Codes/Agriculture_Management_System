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
  const [guidance, setGuidance] = useState('');

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

    try {
      const response = await axios.post('http://localhost:3000/api/crops/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { guidance } = response.data;
      setGuidance(guidance || t('myCrops.noGuidance'));
      alert(t('myCrops.uploadSuccess'));

      setFile(null);
      setName('');
      setStage('');
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      fetchCrops();
    } catch (error) {
      console.error('Error uploading image and stage:', error);
      alert(t('myCrops.uploadError'));
    }
  };

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
        <select value={stage} onChange={handleStageChange} required>
          <option value="">{t('myCrops.selectStage')}</option>
          <option value="Seed">{t('myCrops.stageSeed')}</option>
          <option value="Germination">{t('myCrops.stageGermination')}</option>
          <option value="Vegetative">{t('myCrops.stageVegetative')}</option>
          <option value="Flowering">{t('myCrops.stageFlowering')}</option>
          <option value="Harvest">{t('myCrops.stageHarvest')}</option>
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
            <button
              className="delete-button"
              onClick={() => handleDelete(crop._id)}
            >
              {t('myCrops.deleteButton')}
            </button>
          </div>
        ))}
      </div>

      {guidance && (
        <div className="guidance-section">
          <h3>{t('myCrops.guidanceTitle')}</h3>
          <p>{guidance}</p>
        </div>
      )}
    </div>
  );
};

export default MyCrops;
