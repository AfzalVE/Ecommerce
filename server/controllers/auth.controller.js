import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import logger from "../utils/logger.js";
import nodemailer from "nodemailer";
import "dotenv/config";

/* EMAIL TRANSPORT */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
                           
/* REGISTER USER */

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn(`Register failed - email exists: ${email}`);

      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Register Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* LOGIN USER */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn("Login attempt with missing credentials");

      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Login failed - wrong password: ${email}`);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // ✅ SET COOKIE (CRITICAL FIX)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // 🔥 REQUIRED for cross-site (ngrok/vercel)
      sameSite: "none",   // 🔥 REQUIRED for cross-domain
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Login Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* GET CURRENT USER */

export const getCurrentUser = async (req, res) => {
  try {
    // ✅ user already attached in middleware
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    logger.error("Get User Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* LOGOUT USER */

export const logoutUser = async (req, res) => {
  try {
    // ✅ CLEAR COOKIE PROPERLY
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* SEND OTP */

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
      `,
    });

    logger.info(`OTP sent to ${email}`);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    logger.error("Send OTP Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* VERIFY OTP */

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    logger.error("Verify OTP Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* RESET PASSWORD */

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    await OTP.deleteMany({ email });

    logger.info(`Password reset for ${email}`);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error("Reset Password Error: " + error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};