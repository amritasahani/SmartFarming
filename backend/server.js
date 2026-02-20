// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow your React app's URL
    credentials: true,
}));
app.use(express.json());

// Load Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crop', require('./routes/cropRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/test', require('./routes/testRoutes'));

app.get('/', (req, res) => {
    res.send('Smart Agriculture API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
