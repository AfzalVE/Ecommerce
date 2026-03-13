import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
  verifyOtp,
  resetPassword,
  getCurrentUser
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* AUTH */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

/* CURRENT USER */

router.get("/me", protect, getCurrentUser);

/* PASSWORD RESET */

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;