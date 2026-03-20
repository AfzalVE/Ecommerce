import { Queue } from "bullmq";

export const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});

export const addEmailJob = async (data) => {

  console.log("📨 Adding email job:", data);

  const job = await emailQueue.add("sendInvoiceEmail", data);

  console.log("📨 Job added:", job.id);

};