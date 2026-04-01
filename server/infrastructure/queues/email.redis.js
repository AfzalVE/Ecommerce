import IORedis from "ioredis";
import logger from "../../utils/logger.js";

let emailRedis;

export const getEmailRedis = () => {
  if (emailRedis) return emailRedis;

  const options = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME || "default", // <-- important
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  };

  if (process.env.REDIS_TLS === "true") {
    options.ssl = {};
  }

  emailRedis = new IORedis(options);

  emailRedis.on("connect", () => {
    logger.info("📦 Email Redis connected (ioredis)");
  });

  emailRedis.on("error", (err) => {
    logger.error("❌ Failed to connect ioredis:", err);
  });

  return emailRedis;
};