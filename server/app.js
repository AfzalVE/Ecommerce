import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import clientRoutes from "./routesIndex/client.routes.js";
import adminRoutes from "./routesIndex/admin.routes.js";
import webhookRoutes from "./routes/webhook/razorpay.routes.js";




const app = express();


/*
 🔥 WEBHOOK (MUST COME FIRST)
*/
app.use("/api/webhook", webhookRoutes);


//  🔥 MIDDLEWARE

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://postcanonical-joy-nonradiating.ngrok-free.dev",
    "https://l78993p4-5173.inc1.devtunnels.ms",
    "https://ecommerce-self-mu-45.vercel.app"
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

/*
 🔥 STATIC FILES
*/
app.use("/api/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/api/uploads", express.static("uploads"));

/*
 🔥 ROUTES
*/
app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API running" });
});

app.use("/api", clientRoutes);
app.use("/api/admin", adminRoutes);

export default app;