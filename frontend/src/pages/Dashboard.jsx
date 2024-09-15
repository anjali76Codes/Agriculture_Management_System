import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js for the Doughnut chart
import "../styles/Dashboard.css";
import logo from "../assets/logo.png";

const Dashboard = () => {
  // New Doughnut chart data for product rent/non-rent status
  const rentStatusData = {
    labels: ["Rented Products", "Available Products"],
    datasets: [
      {
        data: [150, 50], // Example data
        backgroundColor: ["#ff6384", "#36a2eb"],
        hoverBackgroundColor: ["#ff6384", "#36a2eb"],
      },
    ],
  };

  // New Sales Data for graph of sales/month
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales ($)",
        data: [1200, 1500, 1700, 1300, 1600, 1800, 1900],
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        tension: 0.4,
      },
    ],
  };

  // Weather Forecast Line Chart Data
  const weatherData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [25, 22, 24, 26, 28, 29, 27],
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,

        font: {
          size: 20,
          weight: "bold",
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
        },
        bodyFont: {
          size: 14,
        },
      },
      legend: {
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months/Days",
          font: {
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
          font: {
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="header-title">
            <h2>Agrocomplex</h2>
            <p>Agriculture overview dashboard</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters">
          <div className="filter-item">
            <label>Region</label>
            <select>
              <option>All regions</option>
              <option>North</option>
              <option>South</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Season</label>
            <select>
              <option>2017</option>
              <option>2018</option>
              <option>2019</option>
            </select>
          </div>
          <button className="stats-button">Today's stats</button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard">
        {/* Left Column */}
        <div>
          {/* Product Rent/Non-Rent Status Card */}
          <div className="card">
            <div className="card-header">Product Rent/Non-Rent Status</div>
            <div className="chart-container">
              <Doughnut data={rentStatusData} />
            </div>
          </div>

          {/* Sales Graph */}
          <div className="card">
            <div className="card-header">Sales Overview (Monthly)</div>
            <div className="chart-container">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Weather Forecasting */}
          <div className="card weather-card">
            <div className="card-header">Weather Forecast (Next 7 Days)</div>
            <div className="chart-container">
              <Line data={weatherData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;






















// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
// import 'chart.js/auto';
// import '../styles/Dashboard.css';
// import logo from '../assets/logo.png';

// const Dashboard = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/weather');
//         setWeatherData(response.data);
//         setError(null); // Clear any previous errors
//       } catch (error) {
//         console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
//         setError('Failed to load weather data');
//       }
//     };

//     fetchWeatherData();
//   }, []);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Weather Forecast (Next 7 Days)',
//         font: {
//           size: 20,
//           weight: 'bold',
//         },
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (tooltipItem) => `Temperature: ${tooltipItem.raw} °C`,
//         },
//         bodyFont: {
//           size: 14,
//         },
//       },
//       legend: {
//         labels: {
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//           usePointStyle: true,
//         },
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Date',
//           font: {
//             size: 16,
//             weight: 'bold',
//           },
//         },
//         ticks: {
//           font: {
//             size: 14,
//           },
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Temperature (°C)',
//           font: {
//             size: 16,
//             weight: 'bold',
//           },
//         },
//         ticks: {
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Header Section */}
//       <header className="dashboard-header">
//         <div className="logo-section">
//           <img src={logo} alt="Logo" className="dashboard-logo" />
//           <div className="header-title">
//             <h2>Agrocomplex</h2>
//             <p>Agriculture overview dashboard</p>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="filters">
//           <div className="filter-item">
//             <label>Region</label>
//             <select>
//               <option>All regions</option>
//               <option>North</option>
//               <option>South</option>
//             </select>
//           </div>
//           <div className="filter-item">
//             <label>Season</label>
//             <select>
//               <option>2017</option>
//               <option>2018</option>
//               <option>2019</option>
//             </select>
//           </div>
//           <button className="stats-button">Today's stats</button>
//         </div>
//       </header>

//       {/* Main Dashboard Layout */}
//       <div className="dashboard">
//         {/* Right Column */}
//         <div>
//           {/* Weather Forecasting */}
//           <div className="card weather-card">
//             <div className="card-header">Weather Forecast (Next 7 Days)</div>
//             <div className="chart-container">
//               {error ? (
//                 <p>{error}</p>
//               ) : weatherData ? (
//                 <Line data={weatherData} options={chartOptions} />
//               ) : (
//                 <p>Loading weather data...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
