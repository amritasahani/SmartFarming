// backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();

// @desc    Test API endpoint
// @route   GET /api/test
// @access  Public
router.get('/', (req, res) => {
    res.json({ message: "Backend is working" });
});

module.exports = router;
