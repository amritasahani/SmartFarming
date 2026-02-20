// @desc    Get market prices for crops
// @route   GET /api/market
// @access  Private
const getMarketPrices = async (req, res) => {
    try {
        // Mocking a government or commodity market API response
        const marketPrices = [
            { id: 1, crop: 'Wheat', currentPrice: 2200, trend: 'up', change: '+2%' },
            { id: 2, crop: 'Rice', currentPrice: 3100, trend: 'stable', change: '0%' },
            { id: 3, crop: 'Maize', currentPrice: 1850, trend: 'down', change: '-1.5%' },
            { id: 4, crop: 'Cotton', currentPrice: 5800, trend: 'up', change: '+5%' },
            { id: 5, crop: 'Soybean', currentPrice: 4200, trend: 'down', change: '-3%' },
        ];

        res.json(marketPrices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMarketPrices };
