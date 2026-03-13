import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import { seedAdmin } from "./loaders/dataLoader.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import cartRoutes from "./routes/cart.routes.js";





dotenv.config();

const app = express();

/*
 MIDDLEWARE
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/uploads", express.static("uploads"));

/*
 HEALTH CHECK
*/

app.get("/", (req, res) => {
 res.json({
  message: "Ecommerce API running"
 });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);

/*
 SERVER START
*/

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