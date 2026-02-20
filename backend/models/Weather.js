const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        city: {
            type: String,
            required: true,
        },
        current: {
            temp: Number,
            condition: String,
            humidity: Number,
            windSpeed: Number
        },
        forecast: [
            {
                day: String,
                date: String,
                tempMin: Number,
                tempMax: Number,
                condition: String
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;
