import { Worker } from "bullmq";
import Order from "../../models/order.model.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";
import redisClient from "../../config/redis.js";
const connection = redisClient.duplicate();
await connection.connect();
export const worker = new Worker(
  "orderQueue",
  async (job) => {
    const { orderId } = job.data;

    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) throw new Error("Order not found");

    const pdfPath = await generateInvoicePDF(order);
    order.invoicePath = pdfPath;
    await order.save();

    await sendMail({
      to: order.user.email,
      subject: `Invoice for Order ${order.orderNumber}`,
      text: "Thank you for your order. Your invoice is attached.",
      attachments: [{ filename: `invoice-${order.orderNumber}.pdf`, path: pdfPath }]
    },
  {
    connection: redisClient.duplicate()
  });
  },
  {
    connection: redisClient.duplicate(), // ✅ duplicate Node Redis v4 client for worker
  }
);