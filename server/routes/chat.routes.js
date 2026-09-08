import express from "express";
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getSuggestedQuestions,
} from "../controllers/chat.controller.js";

const router = express.Router();

// POST /chat/send
router.post("/send", sendMessage);

// GET /chat/history
router.get("/history", getChatHistory);

// POST /chat/clear
router.post("/clear", clearChatHistory);

// GET /chat/suggested-questions
router.get("/suggested-questions", getSuggestedQuestions);

export default router;