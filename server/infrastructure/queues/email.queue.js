import { Queue } from "bullmq";
import logger from "../../utils/logger.js";
import { getEmailRedis } from "./email.redis.js";

let emailQueue;

export const initEmailQueue = () => {
  if (emailQueue) return emailQueue;

  const connection = getEmailRedis();

  emailQueue = new Queue("emailQueue", { connection });

  logger.info("📦 Email queue initialized");
  return emailQueue;
};

export const addEmailJob = async (data) => {
  if (!emailQueue) throw new Error("Email queue not initialized. Call initEmailQueue() first.");
  const job = await emailQueue.add("sendInvoiceEmail", data);
  logger.info(`📨 Job added: ${job.id}`, data);
  return job;
};