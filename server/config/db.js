import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {

 try {

  await mongoose.connect(process.env.MONGO_URI);

  logger.info("MongoDB connected");

 } catch (error) {

  logger.error("MongoDB connection failed: " + error.message);

  process.exit(1);
 }

};

export default connectDB;