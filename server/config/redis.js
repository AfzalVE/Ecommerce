import { createClient } from "redis";
import logger from "../utils/logger.js";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    ssl: process.env.REDIS_TLS === "true" ? {} : undefined,
  },
  username: process.env.REDIS_USERNAME || "default", // <-- important
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => {
  logger.error("❌ Redis error:", err);
});

redisClient.on("connect", () => {
  logger.info("✅ Redis connected (redis v4 client)");
});

await redisClient.connect();

export default redisClient;