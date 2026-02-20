// @desc    Send message to AI chatbot
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Mocking an AI response for demonstration
        // In a real application, you would call OpenAI API or Gemini API here
        let reply = "I am a virtual agriculture assistant. I can help with crop advice, weather, and market trends.";

        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            reply = "Hello! How can I assist you with your farming needs today?";
        } else if (lowerMsg.includes('disease') || lowerMsg.includes('sick')) {
            reply = "If your crops are showing signs of disease, please describe the symptoms (e.g., yellow leaves, spots) or use our image upload feature in the future updates.";
        } else if (lowerMsg.includes('price')) {
            reply = "You can check the latest market prices in the Market Prices section of the dashboard.";
        } else if (lowerMsg.includes('weather')) {
            reply = "The weather forecast is available on your dashboard based on your farm location.";
        }

        res.json({
            userMessage: message,
            aiReply: reply
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { chatWithAI };
