import { Queue } from "bullmq";

const orderQueue = new Queue("orderQueue", {
 connection: {
  host: "127.0.0.1",
  port: 6379
 }
});

export default orderQueue;