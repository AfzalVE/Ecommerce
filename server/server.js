import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import { seedAdmin } from "./loaders/dataLoader.js";
import app from "./app.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });

  } catch (error) {
    logger.error("Server startup failed: " + error.message);
    process.exit(1);
  }
};

startServer();