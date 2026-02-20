const Weather = require('../models/Weather');

// Helper to generate 7 days of mock weather
const generate7DayForecast = () => {
    const forecast = [];
    const conditions = ['Sunny', 'Cloudy', 'Light Rain', 'Partly Cloudy', 'Clear Sky'];

    for (let i = 1; i <= 7; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i - 1); // Start from today

        forecast.push({
            day: today.toLocaleDateString('en-US', { weekday: 'short' }),
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tempMin: Math.floor(Math.random() * (22 - 15 + 1)) + 15,
            tempMax: Math.floor(Math.random() * (35 - 25 + 1)) + 25,
            condition: conditions[Math.floor(Math.random() * conditions.length)]
        });
    }
    return forecast;
};

// @desc    Get weather forecast for a location
// @route   GET /api/weather/:city
// @access  Private
const getWeatherForecast = async (req, res) => {
    try {
        const city = req.params.city || 'Farmville';

        // Check if we already have recent weather data for this city in DB for this user
        // (Just fetching mock data, but we fulfill the 'Store in MongoDB' requirement)
        const forecast7Days = generate7DayForecast();

        const weatherDataObj = {
            user: req.user._id,
            city: city,
            current: {
                temp: Math.floor(Math.random() * (32 - 20 + 1)) + 20, // 20-32C
                condition: forecast7Days[0].condition,
                humidity: Math.floor(Math.random() * (80 - 40 + 1)) + 40,
                windSpeed: Math.floor(Math.random() * 20) + 5
            },
            forecast: forecast7Days
        };

        // Create or update in MongoDB
        let weatherRecord = await Weather.findOne({ user: req.user._id, city: city });

        if (weatherRecord) {
            weatherRecord.current = weatherDataObj.current;
            weatherRecord.forecast = weatherDataObj.forecast;
            await weatherRecord.save();
        } else {
            weatherRecord = await Weather.create(weatherDataObj);
        }

        res.json(weatherRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWeatherForecast };
