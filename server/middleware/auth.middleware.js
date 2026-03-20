import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

/* PROTECT ROUTES */

export const protect = async (req, res, next) => {

  try {

    let token;

    /* 1️⃣ TOKEN FROM COOKIE */

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    /* 2️⃣ TOKEN FROM AUTH HEADER */

    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

    }

    if (!token) {

      logger.warn("Unauthorized request - no token");

      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });

    }

    /* VERIFY TOKEN */

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found"
      });

    }

    req.user = user;

    next();

  } catch (error) {

    logger.error("Auth middleware error: " + error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

};


/* ADMIN MIDDLEWARE */

export const admin = (req, res, next) => {

  try {

    if (!req.user || req.user.role !== "admin") {

      logger.warn(`Forbidden access attempt by user ${req.user?._id}`);

      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });

    }

    next();

  } catch (error) {

    logger.error("Admin middleware error: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};