import logger from "../utils/logger.js";

export const isAdmin = (req, res, next) => {

  if (!req.user) {

    logger.warn("Admin access attempt without authentication");

    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });

  }

  if (req.user.role !== "admin") {

    logger.warn(`Unauthorized admin route access by user: ${req.user.email}`);

    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });

  }

  next();

};