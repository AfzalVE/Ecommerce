import { Worker } from "bullmq";

const worker = new Worker(
 "orderQueue",
 async (job) => {

  const { orderId } = job.data;

  await generateInvoice(orderId);
  await sendOrderEmail(orderId);

 },
 {
  connection: {
   host: "127.0.0.1",
   port: 6379
  }
 }
);