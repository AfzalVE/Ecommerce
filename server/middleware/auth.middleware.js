import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

/* ==============================
   🔐 PROTECT ROUTES (FIXED)
============================== */
export const protect = async (req, res, next) => {
  try {
    let token;
   
    /* =========================
       1️⃣ GET TOKEN FROM COOKIE
    ========================== */
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    /* =========================
       2️⃣ GET TOKEN FROM HEADER
    ========================== */
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /* =========================
       ❌ NO TOKEN
    ========================== */
    if (!token) {
      logger.warn(`❌ No token | ${req.method} ${req.originalUrl}`);

      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    /* =========================
       ✅ VERIFY TOKEN
    ========================== */
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      logger.warn(`❌ Invalid token | ${req.originalUrl}`);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    /* =========================
       ❌ INVALID PAYLOAD
    ========================== */
    if (!decoded?.userId) {
      logger.warn(`❌ Token missing userId`);

      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    /* =========================
       ✅ FETCH USER
    ========================== */
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      logger.warn(`❌ User not found for token`);

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* =========================
       ✅ ATTACH USER
    ========================== */
    req.user = user;

    // 🔥 DEBUG (you can remove later)
    // console.log("✅ AUTH USER:", user._id);

    next();

  } catch (error) {
    logger.error("❌ Auth middleware error: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};


/* ==============================
   🔒 ADMIN MIDDLEWARE (IMPROVED)
============================== */
export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      logger.warn(`❌ Admin check failed: No user on request`);

      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      logger.warn(
        `❌ ADMIN DENIED | ${req.method} ${req.originalUrl} | USER: ${req.user.email}`
      );

      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();

  } catch (error) {
    logger.error("❌ Admin middleware error: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};