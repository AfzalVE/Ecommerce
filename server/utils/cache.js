import redis from "../config/redis.js";
import logger from "./logger.js";

/* ✅ WRITE HERE */
export const getOrSetCache = async (key, cb, expiry = 60) => {
  try {
    const cachedData = await redis.get(key);

    if (cachedData) {
      logger.info(`[CACHE HIT] key=${key}`);
      return JSON.parse(cachedData);
    }

    logger.info(`[CACHE MISS] key=${key}`);

    const freshData = await cb();

    await redis.setEx(key, expiry, JSON.stringify(freshData));

    logger.info(`[CACHE SET] key=${key} ttl=${expiry}s`);

    return freshData;

  } catch (err) {
    logger.error(`[CACHE ERROR] key=${key} error=${err.message}`);
    return await cb();
  }
};