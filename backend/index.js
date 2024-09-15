const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load routers
const userRouter = require('./routes/user.route'); // Ensure this path is correct


// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 if specified in .env

// Enable CORS for requests from frontend (React app)
app.use(cors({
    origin: 'http://localhost:5173', // Ensure this matches your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use user router
app.use('/api/users', userRouter); // Update this if the path is different



// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose is connected"))
    .catch((err) => console.log("Error in connecting Mongoose:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
