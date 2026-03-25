import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import mongoose from "mongoose";
import { Worker } from "bullmq";
import connectDB from "../../config/db.js";
import logger from "../../utils/logger.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";
import "../../models/user.model.js";
import Order from "../../models/order.model.js";
import redisClient from "../../config/redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   ENV CONFIG
========================= */
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/* =========================
   START WORKER
========================= */


const startWorker = async () => {
  try {
    /* connect database */
    await connectDB();

    logger.info("📦 Email Worker started");

    const worker = new Worker(
      "emailQueue",

      async (job) => {
        logger.info(`📨 Job received: ${job.name}`);

        if (job.name !== "sendInvoiceEmail") {
          logger.warn(`⚠️ Unknown job type: ${job.name}`);
          return;
        }

        try {
          const { orderId } = job.data;

          logger.info(`🔎 Finding order: ${orderId}`);

          const order = await Order.findById(orderId).populate(
            "user",
            "name email"
          );

          if (!order) {
            logger.error(`❌ Order not found: ${orderId}`);
            return;
          }

          logger.info(`✅ Order found: ${order.orderNumber}`);

          /* =========================
             GENERATE INVOICE
          ========================== */

          logger.info("📄 Generating invoice PDF");

          const pdfPath = await generateInvoicePDF(order);

          logger.info(`✅ PDF generated: ${pdfPath}`);

          order.invoicePath = pdfPath;
          await order.save();

          logger.info("💾 Invoice path saved to DB");

          /* =========================
             SEND EMAIL
          ========================== */

          logger.info(`📧 Sending email to: ${order.user.email}`);

          await sendMail({
            to: order.user.email,
            subject: `Invoice for Order ${order.orderNumber}`,
            text: "Thank you for your order. Your invoice is attached.",
            attachments: [
              {
                filename: `invoice-${order.orderNumber}.pdf`,
                path: pdfPath,
              },
            ],
          });

          logger.info("✅ Email sent successfully");
        } catch (error) {
          logger.error(`❌ Worker job error: ${error.message}`);
          throw error;
        }
      },

      {
        connection: redisClient, // ✅ USE REDIS CLIENT
      }
    );

    /* =========================
       WORKER EVENTS
    ========================== */

    worker.on("completed", (job) => {
      logger.info(`🎉 Job completed: ${job.id}`);
    });

    worker.on("failed", (job, err) => {
      logger.error(`💥 Job failed: ${job?.id} | ${err.message}`);
    });

    worker.on("error", (err) => {
      logger.error(`❌ Worker crashed: ${err.message}`);
    });
  } catch (error) {
    logger.error(`❌ Worker startup failed: ${error.message}`);
    process.exit(1);
  }
};

/* =========================
   START
========================= */

startWorker();

/* =========================
   GRACEFUL SHUTDOWN
========================= */

process.on("SIGINT", async () => {
  logger.info("🛑 Worker shutting down");

  await mongoose.disconnect();
  await redisClient.quit(); // ✅ close redis connection

  process.exit(0);
});