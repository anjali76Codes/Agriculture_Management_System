const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const userRouter = require('./routes/user.route'); // Ensure this path is correct
const productRouter = require('./routes/product.route'); // Include the product routes

dotenv.config(); // Load environment variables from the default .env file

const app = express();
const PORT = process.env.PORT || 3000; // Use default port 3000 if not specified

// Use cors middleware
app.use(cors({
    origin: 'http://localhost:5173', // Replace with the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If you need to support cookies or authentication
}));

app.use(express.json());
app.use('/api', userRouter); // Correctly mount the user router
app.use('/api', productRouter); // Mount product router here

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose is connected"))
    .catch((err) => console.log("Error in connecting Mongoose:", err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
