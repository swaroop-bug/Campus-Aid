const chatbotService = require('../services/chatbotService');

const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await chatbotService.sendMessage(message.trim());
    return res.json(result);
  } catch (error) {
    console.error('Chatbot Controller Error:', error.message);
    return res.status(500).json({ reply: 'Something went wrong. Please try again.' });
  }
};

module.exports = { sendMessage };
