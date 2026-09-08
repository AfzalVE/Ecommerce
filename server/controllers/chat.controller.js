import { generateAIResponse } from "../services/chat.service.js";

// Temporary in-memory storage (replace with DB later)
let chatHistory = [];

// 🗨️ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call AI service
    const aiReply = await generateAIResponse(message);

    const chat = {
      user: message,
      bot: aiReply,
      timestamp: new Date(),
    };
    chatHistory.push(chat);
    res.json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🕵️‍♂️ Get Chat History
export const getChatHistory = async (req, res) => {
  try {
    res.json({
      success: true,
      data: chatHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🧹 Clear Chat
export const clearChatHistory = async (req, res) => {
  try {
    chatHistory = [];

    res.json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📥 Suggested Questions
export const getSuggestedQuestions = async (req, res) => {
  try {
    const suggestions = [
      "Show me trending products",
      "What are today's best deals?",
      "Track my order",
      "Recommend me shoes under $50",
      "Do you have discounts?",
    ];

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};