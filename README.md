# Demo Url  : https://drive.google.com/file/d/1YMqV5eqyHRIix46zU-EV--unzglEBPKc/view
# AgriCircle - Agriculture Management System

AgriCircle is a modern Agriculture Management System that enables farmers to rent equipment, browse products, access weather forecasts, and receive crop care advice. The system supports multi-language accessibility and secure payment options.

---

## Features

- **Equipment Rental**: Farmers can browse and rent equipment.  
- **Product Browsing**: Explore and purchase agricultural products.  
- **Crop Care Advice**: Uses Gemini API for image-based crop analysis.  
- **Weather Forecasting**: Get current day weather and 5-day forecasts with OpenWeatherMap API.  
- **Farmer Dashboard**: Includes sales tracking, reviews, and product management.  
- **Multi-Language Support**: Available in Hindi, Marathi, and English.  
- **Secure Payments**: Integrated Razorpay for secure payment processing.  

---

## Installation Guide

### Prerequisites

- **Node.js** (v14 or later)  
- **MongoDB** (Local or Cloud Instance)  
- **Razorpay API Key**  
- **OpenWeatherMap API Key**  
- **Gemini API Key**  

---

### Backend Setup

1. **Initialize the Project**  
   ```bash
   mkdir backend
   cd backend
   npm init -y
   
2. **Install Dependencies**

```bash
npm install express mongoose dotenv cors jsonwebtoken bcrypt bcryptjs
npm install --save-dev nodemon

```
**Create Necessary Folders**



```bash
mkdir controllers routes models config

```
**Add Scripts to package.json**
- Update the scripts section:

```
```bash
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
}


```
**Run the Server**

```bash
npm run dev

```
## Frontend Setup
**Initialize the Project**

```bash
mkdir frontend
cd frontend
npm create vite@latest .

```
**Install Additional Dependencies**

```bash
npm install react-datepicker chart.js react-chartjs-2 firebase
Run the Frontend
```
```bash
npm start
```


**API Integrations**
Current Day Weather API

```url

https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={your_api_key}
5-Day Weather Forecast API

```
```url

https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid={your_api_key}

```
**Gemini API for Crop Advice**
- Integrated to analyze crop health based on image uploads.

   
