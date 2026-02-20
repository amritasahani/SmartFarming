const express = require('express');
const router = express.Router();
const { getMarketPrices } = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMarketPrices);

module.exports = router;
