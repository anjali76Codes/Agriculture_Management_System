import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css'; // Import the CSS file

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
);

const API_KEY = '84ebac995b3efbf3e1af2f0ba5ee0204';
const API_URL = 'https://api.openweathermap.org/data/2.5';
const SALES_API_URL = 'http://localhost:3000/api/sales-metrics';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (username) {
      fetchSalesMetrics();
    }
    if (city) {
      fetchWeatherData(city);
    } else {
      fetchCurrentLocationWeather();
    }
  }, [city, username]);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/forecast?q=${city}&appid=${API_KEY}`);
      setWeatherData(res.data);
      setError(null);
    } catch (err) {
      setError("Error fetching weather data. Please check the city name or try again later.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
          const city = res.data.name;
          setCity(city);
        } catch (err) {
          setError("Error fetching weather data for current location.");
        }
      },
      (err) => {
        setError("Error retrieving location. Please make sure location services are enabled.");
      },
      { timeout: 10000 }
    );
  };

  const fetchSalesMetrics = async () => {
    if (!username) {
      setError("Username is not defined.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${SALES_API_URL}?username=${username}`);
      setSalesData(res.data);
      setError(null);
    } catch (err) {
      setError("Error fetching sales metrics.");
      setSalesData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const getDailyForecasts = () => {
    if (!weatherData) return [];
    const forecasts = weatherData.list || [];
    const dailyForecasts = [];
    forecasts.forEach(forecast => {
      const day = new Date(forecast.dt * 1000).toLocaleString('en-US', { weekday: 'long' });
      if (!dailyForecasts.some(d => d.day === day)) {
        dailyForecasts.push({
          day,
          temp: forecast.main.temp - 273.15,
          weather: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          humidity: forecast.main.humidity,
          wind_speed: forecast.wind.speed,
          pressure: forecast.main.pressure,
          clouds: forecast.clouds.all
        });
      }
    });
    return dailyForecasts;
  };

  const dailyForecasts = getDailyForecasts();
  const weatherChartData = {
    labels: dailyForecasts.map(day => day.day),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: dailyForecasts.map(day => day.temp.toFixed(2)),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderWidth: 1
      }
    ]
  };

  const salesDataValues = {
    totalSales: salesData?.totalSales || 0,
    productsForRent: salesData?.totalProductsForRent || 0,
    averageReviews: salesData?.averageReviews || 0
  };

  const salesChartData = {
    labels: ['Total Sales', 'Products for Rent', 'Average Reviews'],
    datasets: [
      {
        label: 'Sales Metrics',
        data: [salesDataValues.totalSales, salesDataValues.productsForRent, salesDataValues.averageReviews],
        backgroundColor: ['rgba(255,99,132,0.2)', 'rgba(54,162,235,0.2)', 'rgba(255,206,86,0.2)'],
        borderColor: ['rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)'],
        borderWidth: 1
      }
    ]
  };

  const rentReviewsChartData = {
    labels: ['Products for Rent', 'Average Reviews'],
    datasets: [
      {
        label: 'Products for Rent vs Average Reviews',
        data: [salesDataValues.productsForRent, salesDataValues.averageReviews],
        backgroundColor: ['rgba(255,159,64,0.2)', 'rgba(75,192,192,0.2)'],
        borderColor: ['rgba(255,159,64,1)', 'rgba(75,192,192,1)'],
        borderWidth: 1
      }
    ]
  };

  const scatterChartData = {
    labels: ['Average Reviews vs Total Sales'],
    datasets: [
      {
        label: 'Reviews vs Sales',
        data: [{
          x: salesDataValues.totalSales,
          y: salesDataValues.averageReviews
        }],
        backgroundColor: 'rgba(255,159,64,0.2)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1
      }
    ]
  };

  const weatherTableData = dailyForecasts.map(day => ({
    day: day.day,
    temperature: `${day.temp.toFixed(2)} °C`,
    weather: day.weather,
    humidity: `${day.humidity}%`,
    windSpeed: `${day.wind_speed} m/s`,
    pressure: `${day.pressure} hPa`,
    clouds: `${day.clouds}%`,
    icon: <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt="weather icon" />
  }));

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Weather and Sales Dashboard</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch} inline>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mr-2"
            />
            <Button type="submit" variant="primary">Search Weather</Button>
          </Form>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col md={6}>
              {weatherData && (
                <Card className="weather-card mb-4">
                  <Card.Body>
                    <h2>5-Day Weather Forecast</h2>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Temperature</th>
                          <th>Weather</th>
                          <th>Humidity</th>
                          <th>Wind Speed</th>
                          <th>Pressure</th>
                          <th>Cloudiness</th>
                          <th>Icon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weatherTableData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.day}</td>
                            <td>{row.temperature}</td>
                            <td>{row.weather}</td>
                            <td>{row.humidity}</td>
                            <td>{row.windSpeed}</td>
                            <td>{row.pressure}</td>
                            <td>{row.clouds}</td>
                            <td>{row.icon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col md={6}>
              {salesData && (
                <>
                  <Card className="sales-card mb-4">
                    <Card.Body>
                      <h2>Sales Metrics (Doughnut Chart)</h2>
                      <Doughnut data={salesChartData} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>

                  <Card className="sales-card mb-4">
                    <Card.Body>
                      <h2>Products for Rent vs Average Reviews (Bar Chart)</h2>
                      <Bar data={rentReviewsChartData} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>

                  <Card className="sales-card mb-4">
                    <Card.Body>
                      <h2>Average Reviews vs Total Sales (Scatter Plot)</h2>
                      <Scatter data={scatterChartData} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>

                  <Card className="sales-card mb-4">
                    <Card.Body>
                      <h2>Total Sales Over Time (Line Chart)</h2>
                      <Line data={weatherChartData} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>
                </>
              )}
            </Col>
          </Row>

          {weatherData && (
            <Card className="weather-card mb-4">
              <Card.Body>
                <h2>5-Day Temperature Forecast</h2>
                <Line data={weatherChartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
