import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Nav, Tab } from 'react-bootstrap';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    if (username) {
      fetchSalesMetrics();
    }
    fetchCurrentLocationWeather();
  }, [username]);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      setWeatherData(res.data);
    } catch {
      setError(t('dashboard.weatherFetchError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentWeather = async (lat, lon) => {
    try {
      const res = await axios.get(`${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      setCurrentWeather(res.data);
    } catch {
      setError(t('dashboard.currentWeatherFetchError'));
    }
  };

  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError(t('dashboard.geolocationNotSupported'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
        fetchCurrentWeather(latitude, longitude);
      },
      () => {
        setError(t('dashboard.locationRetrievalError'));
      },
      { timeout: 10000 }
    );
  };

  const fetchSalesMetrics = async () => {
    if (!username) {
      setError(t('dashboard.usernameUndefined'));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${SALES_API_URL}?username=${username}`);
      setSalesData(res.data);
    } catch {
      setError(t('dashboard.salesMetricsFetchError'));
    } finally {
      setLoading(false);
    }
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
    datasets: [{
      label: t('dashboard.temperatureChartLabel'),
      data: dailyForecasts.map(day => day.temp.toFixed(2)),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderWidth: 2
    }]
  };

  const salesDataValues = {
    totalSales: salesData?.totalSales || 0,
    productsForRent: salesData?.totalProductsForRent || 0,
    averageReviews: salesData?.averageReviews || 0
  };

  const salesChartData = {
    labels: ['Total Sales', 'Products for Rent', 'Average Reviews'], // Plain English labels
    datasets: [{
      label: t('dashboard.salesMetricsLabel'),
      data: [salesDataValues.totalSales, salesDataValues.productsForRent, salesDataValues.averageReviews],
      backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)'],
      borderColor: ['rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)'],
      borderWidth: 2
    }]
  };

  const rentReviewsChartData = {
    labels: ['Products for Rent', 'Average Reviews'],
    datasets: [{
      label: 'Rent Products Reviews',
      data: [salesDataValues.productsForRent, salesDataValues.averageReviews],
      backgroundColor: ['rgba(255,159,64,0.6)', 'rgba(75,192,192,0.6)'],
      borderColor: ['rgba(255,159,64,1)', 'rgba(75,192,192,1)'],
      borderWidth: 2
    }]
  };

  const scatterChartData = {
    labels: 'Scattered Data',
    datasets: [{
      label: 'Revenue',
      data: [{ x: salesDataValues.totalSales, y: salesDataValues.averageReviews }],
      backgroundColor: 'rgba(255,159,64,0.6)',
      borderColor: 'rgba(255,159,64,1)',
      borderWidth: 2
    }]
  };

  const totalSalesOverTimeData = {
    labels: dailyForecasts.map(day => day.day),
    datasets: [{
      label: 'Total Sales overtime',
      data: dailyForecasts.map(() => salesDataValues.totalSales), // Replace with actual sales data if available
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderWidth: 2
    }]
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
      <h1 className="text-center mb-4">{t('dashboard.title')}</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          <Tab.Container id="left-tabs-example" defaultActiveKey="currentWeather">
            <Row>
              <Col sm={4}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="currentWeather">{t('dashboard.currentWeatherTab')}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="forecast">{t('dashboard.forecastTab')}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="salesMetrics">{t('dashboard.salesMetricsTab')}</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="currentWeather">
                    {currentWeather && (
                      <Card className="weathercontainer mb-4">
                        <Card.Body>
                          <h2>{t('dashboard.currentWeatherTitle')}</h2>
                          <Card.Text>
                            <section>
                              <p><strong>Temperature:</strong> {(currentWeather.main.temp - 273.15).toFixed(2)} °C</p>
                              <p><strong>Weather:</strong> {currentWeather.weather[0].description}</p>
                              <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
                              <p><strong>Wind Speed:</strong> {currentWeather.wind.speed} m/s</p>
                              <p><strong>Pressure:</strong> {currentWeather.main.pressure} hPa</p>
                              <p><strong>Clouds:</strong> {currentWeather.clouds.all}%</p>
                            </section>
                            <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`} alt="weather icon" />
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="forecast">
                    {weatherData && (
                      <Card className="mb-4">
                        <Card.Body>
                          <h2>{t('dashboard.forecastTitle')}</h2>
                          <Line data={weatherChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                          <p className="text-muted">{t('dashboard.temperatureForecastDescription')}</p>
                        </Card.Body>
                      </Card>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="salesMetrics">
                    {salesData && (
                      <>
                        <Card className="mb-4">
                          <Card.Body>
                            <h2>{t('dashboard.salesMetricsDoughnutTitle')}</h2>
                            <Doughnut data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            <p className="text-muted">{t('dashboard.salesMetricsDescription')}</p>
                          </Card.Body>
                        </Card>

                        <Card className="mb-4">
                          <Card.Body>
                            <h2>{t('dashboard.rentReviewsTitle')}</h2>
                            <Bar data={rentReviewsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            <p className="text-muted">{t('dashboard.rentReviewsDescription')}</p>
                          </Card.Body>
                        </Card>

                        <Card className="mb-4">
                          <Card.Body>
                            <h2>{t('dashboard.reviewsVsSalesTitle')}</h2>
                            <Scatter data={scatterChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            <p className="text-muted">{t('dashboard.reviewsVsSalesDescription')}</p>
                          </Card.Body>
                        </Card>

                        <Card className="mb-4">
                          <Card.Body>
                            <h2>{t('dashboard.totalSalesOverTimeTitle')}</h2>
                            <Line data={totalSalesOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
                            <p className="text-muted">{t('dashboard.totalSalesOverTimeDescription')}</p>
                          </Card.Body>
                        </Card>
                      </>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
