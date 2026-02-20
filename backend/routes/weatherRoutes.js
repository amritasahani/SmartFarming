const express = require('express');
const router = express.Router();
const { getWeatherForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:city', protect, getWeatherForecast);

module.exports = router;
