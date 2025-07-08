// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default Route
app.get('/', (req, res) => {
  res.send('🎉 School Management API is running');
});

// Add after middleware
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
