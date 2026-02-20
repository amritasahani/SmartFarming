const express = require('express');
const router = express.Router();
const { recommendCrop, getRecommendationHistory, autoDetectEnvironment } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, recommendCrop);
router.post('/auto-detect', autoDetectEnvironment);
router.get('/history', protect, getRecommendationHistory);

module.exports = router;
