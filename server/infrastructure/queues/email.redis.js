import IORedis from "ioredis";
import logger from "../../utils/logger.js";

let emailRedis;

export const getEmailRedis = () => {
  if (emailRedis) return emailRedis;

  emailRedis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null, // required by BullMQ
  });

  emailRedis.on("connect", () => {
    logger.info("📦 Email Redis connected");
  });

  emailRedis.on("error", (err) => {
    logger.error("❌ Failed to connect ioredis:", err);
  });

  return emailRedis;
};