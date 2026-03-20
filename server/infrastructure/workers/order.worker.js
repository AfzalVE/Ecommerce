
import { Worker } from "bullmq";
import Order from "../../models/order.model.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

const worker = new Worker(
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
   });
 },
 {
   connection: { host: "127.0.0.1", port: 6379 }
 }
);