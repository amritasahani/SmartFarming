const CropRecommendation = require('../models/CropRecommendation');
const axios = require('axios');

// Helper function with rule-based algorithm
const getRecommendation = (soilType, temp, rainfall, season) => {
    let cropName = 'Mixed Cropping';
    let fertilizerAdvice = 'Use standard NPK fertilizers and organic compost.';

    soilType = soilType.toLowerCase();
    season = season.toLowerCase();

    // Kharif (Monsoon) Crops
    if (season === 'kharif') {
        if (rainfall > 100 && temp >= 25) {
            if (soilType === 'clay' || soilType === 'loamy') {
                cropName = 'Rice';
                fertilizerAdvice = 'Requires high Nitrogen. Apply Urea in split doses. Ensure standing water.';
            } else if (soilType === 'black') {
                cropName = 'Cotton';
                fertilizerAdvice = 'Apply DAP at sowing. Top dress with Nitrogen. Watch out for bollworms.';
            } else {
                cropName = 'Maize';
                fertilizerAdvice = 'Needs good drainage. Apply Zinc sulphate if soil is deficient.';
            }
        } else if (rainfall >= 50 && rainfall <= 100) {
            cropName = 'Jowar / Millets';
            fertilizerAdvice = 'Drought-resistant. Minimal chemical fertilizers needed; prefer farmyard manure.';
        }
    }
    // Rabi (Winter) Crops
    else if (season === 'rabi') {
        if (temp >= 10 && temp <= 25) {
            if (soilType === 'loamy' || soilType === 'clay') {
                cropName = 'Wheat';
                fertilizerAdvice = 'Apply basal dose of NPK. Adequate irrigation during crown root initiation is crucial.';
            } else if (soilType === 'sandy' || soilType === 'loamy') {
                cropName = 'Mustard';
                fertilizerAdvice = 'Sulphur application is essential for oil content. Use SSP instead of DAP.';
            } else {
                cropName = 'Chickpea (Gram)';
                fertilizerAdvice = 'Seed treatment with Rhizobium culture recommended. Avoid excess irrigation.';
            }
        }
    }
    // Zaid (Summer) Crops
    else if (season === 'zaid') {
        if (temp > 25 && rainfall < 50) {
            if (soilType === 'sandy' || soilType === 'loamy') {
                cropName = 'Watermelon / Muskmelon';
                fertilizerAdvice = 'Apply well-rotted FYM. Water-soluble fertilizers through drip irrigation yield best results.';
            } else {
                cropName = 'Cucumber / Bitter Gourd';
                fertilizerAdvice = 'Keep soil moist. Apply organic manure before sowing.';
            }
        }
    }
    // All Season / General Conditions
    else {
        if (soilType === 'loamy' || soilType === 'red') {
            if (temp >= 20 && temp <= 30) {
                cropName = 'Tomatoes / Potatoes';
                fertilizerAdvice = 'Requires balanced NPK. For potatoes, avoid excessive Nitrogen late in the season.';
            }
        }
    }

    // Edge Cases fallback
    if (cropName === 'Mixed Cropping') {
        if (rainfall < 40) {
            cropName = 'Pearl Millet (Bajra)';
            fertilizerAdvice = 'Highly drought tolerant. Needs very little chemical intervention.';
        } else if (soilType === 'sandy') {
            cropName = 'Groundnut';
            fertilizerAdvice = 'Apply Gypsum at pegging stage for better pod formation.';
        }
    }

    return { cropName, fertilizerAdvice };
};

// @desc    Get crop recommendation based on params
// @route   POST /api/crop/recommend
// @access  Private
const recommendCrop = async (req, res) => {
    try {
        const { soilType, temperature, rainfall, season } = req.body;

        if (!soilType || temperature === undefined || rainfall === undefined || !season) {
            return res.status(400).json({ message: 'Please provide soilType, temperature, rainfall, and season' });
        }

        const { cropName, fertilizerAdvice } = getRecommendation(soilType, temperature, rainfall, season);

        const recommendation = await CropRecommendation.create({
            user: req.user._id,
            soilType,
            temperature,
            rainfall,
            season,
            recommendedCrop: cropName,
            fertilizerAdvice
        });

        res.status(201).json({
            cropName,
            fertilizerAdvice,
            savedRecord: recommendation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's past recommendations
// @route   GET /api/crop/history
// @access  Private
const getRecommendationHistory = async (req, res) => {
    try {
        const history = await CropRecommendation.find({ user: req.user._id }).sort('-createdAt');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auto detect environment via AWS Lambda API Gateway proxy
// @route   POST /api/crop/auto-detect
// @access  Public
const autoDetectEnvironment = async (req, res) => {
    try {
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        // Call AWS API Gateway if URL is provided in .env, otherwise mock it for local development
        const awsEndpoint = process.env.AWS_API_GATEWAY_URL;

        let data;
        if (awsEndpoint) {
            const awsRes = await axios.post(awsEndpoint, {
                lat,
                lon,
                userId: req.user ? req.user._id : 'anonymous_request'
            });
            data = awsRes.data;
        } else {
            // MOCK FALLBACK: Simulate the AWS response if the cloud infrastructure isn't deployed yet
            data = {
                message: "Test Response: AWS Lambda not configured. Returning mock environment data.",
                temperature: 28.5,
                rainfall: 110,
                season: 'Kharif',
                soilType: 'Black',
                location: 'Mocked Location'
            };
        }

        res.json(data);
    } catch (error) {
        console.error("Auto detect proxy error:", error);
        res.status(500).json({ message: "Failed to auto-detect environment metrics from AWS Lambda." });
    }
};

module.exports = { recommendCrop, getRecommendationHistory, autoDetectEnvironment };
