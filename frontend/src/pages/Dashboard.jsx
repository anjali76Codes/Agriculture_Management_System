import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const FetchData = async (location) => {
    try {
      const geoRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=84ebac995b3efbf3e1af2f0ba5ee0204`);
      const { lat, lon } = geoRes.data.coord;

      const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=84ebac995b3efbf3e1af2f0ba5ee0204`);
      setWeatherData(res.data);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
      setWeatherData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (location.trim()) {
      setSubmit(true);
      await FetchData(location);
      setSubmit(false);
    }
  };

  const getDailyForecasts = () => {
    const forecasts = weatherData?.list || [];
    const dailyForecasts = [];
    forecasts.forEach(forecast => {
      const day = new Date(forecast.dt * 1000).toLocaleString('en-US', { weekday: 'long' });
      if (!dailyForecasts.some(d => d.day === day)) {
        dailyForecasts.push({
          day,
          temp: forecast.main.temp - 273.15, // Convert from Kelvin to Celsius
          weather: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          humidity: forecast.main.humidity,
          wind_speed: forecast.wind.speed,
          pressure: forecast.main.pressure, // Pressure detail for farmers
          clouds: forecast.clouds.all // Cloudiness
        });
      }
    });
    return dailyForecasts;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1>Weather Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Enter location" 
          />
          <button type="submit" disabled={submit}>Submit</button>
        </form>
        {submit && <p className="loading">Loading...</p>}
        {error && <div className="error">{error}</div>}
        {weatherData && (
          <div className="weather-info">
            {/* Current weather with button to toggle details */}
            <div className="current-weather">
              <h2>{weatherData.city.name}</h2>
              <img src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`} alt="weather icon" />
              <p><strong>{(weatherData.list[0].main.temp - 273.15).toFixed(2)}°C</strong></p>
              <p>{weatherData.list[0].weather[0].description}</p>
              <button className="details-button" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide Details" : "See Details"}
              </button>

              {/* Detailed info for the current day (show/hide on button click) */}
              {showDetails && (
                <div className="details">
                  <p><strong>Humidity:</strong> {weatherData.list[0].main.humidity}%</p>
                  <p><strong>Wind Speed:</strong> {weatherData.list[0].wind.speed} m/s</p>
                  <p><strong>Pressure:</strong> {weatherData.list[0].main.pressure} hPa</p>
                  <p><strong>Cloudiness:</strong> {weatherData.list[0].clouds.all}%</p>
                </div>
              )}
            </div>

            {/* 5-day forecast */}
            <div className="forecast">
              {getDailyForecasts().map((day, index) => (
                <div key={index} className="daily-weather">
                  <h3>{day.day}</h3>
                  <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="weather icon" />
                  <p>{day.temp.toFixed(2)}°C</p>
                  <p>{day.weather}</p>
                
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
