const mongoose = require('mongoose');

const cropRecommendationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        soilType: {
            type: String,
            required: true,
            enum: ['Sandy', 'Clay', 'Loamy', 'Black', 'Red']
        },
        temperature: {
            type: Number,
            required: true
        },
        rainfall: {
            type: Number,
            required: true
        },
        season: {
            type: String,
            required: true,
            enum: ['Kharif', 'Rabi', 'Zaid', 'All']
        },
        recommendedCrop: {
            type: String,
            required: true
        },
        fertilizerAdvice: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);
module.exports = CropRecommendation;
