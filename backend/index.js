const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow CORS for frontend requests
app.use(bodyParser.json());

// Routes
app.use('/notes', notesRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO; // Ensure this matches the variable in your .env file
if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1); // Exit if MongoDB URI is missing
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the process on connection failure
    });

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
} else {
    console.log('Backend running in development mode');
}

// Handle invalid routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
