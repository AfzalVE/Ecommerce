import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      /* =======================
         CREATE DIRECTORY
      ======================== */
      const invoiceDir = path.join(process.cwd(), "invoices");

      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir);
        console.log("📁 Created invoices folder");
      }

      const filePath = path.join(
        invoiceDir,
        `${order.orderNumber}.pdf`
      );

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      /* =======================
         HEADER
      ======================== */
      doc
        .fontSize(20)
        .text("ShopSphere", { align: "left" })
        .fontSize(10)
        .text("EM Block")
        .text("Kolkata, West Bengal, 711402")
        .text("Email: support@shopsphere.com")
        .moveDown();

      doc
        .fontSize(22)
        .text("INVOICE", { align: "right" })
        .moveDown();

      /* =======================
         INVOICE DETAILS
      ======================== */
      doc
        .fontSize(12)
        .text(`Invoice No: ${order.orderNumber}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
        .text(`Payment Status: ${order.paymentStatus}`)
        .moveDown();

      /* =======================
         CUSTOMER DETAILS
      ======================== */
      doc
        .fontSize(14)
        .text("Bill To:", { underline: true })
        .fontSize(12)
        .text(order.address.name)
        .text(order.address.email)
        .text(order.address.phone || "")
        .text(order.address.addressLine || "")
        .moveDown();

      /* =======================
         TABLE HEADER
      ======================== */
      doc
        .fontSize(12)
        .text("Item", 50, doc.y, { continued: true })
        .text("Qty", 250, doc.y, { continued: true })
        .text("Price", 300, doc.y, { continued: true })
        .text("Total", 400);

      doc.moveDown();

      /* =======================
         ITEMS
      ======================== */
      let subtotal = 0;

      order.items.forEach((item) => {
        const total = item.quantity * item.finalPrice;
        subtotal += total;

        doc
          .text(item.name, 50, doc.y, { continued: true })
          .text(item.quantity.toString(), 250, doc.y, { continued: true })
          .text(`${item.finalPrice}/-`, 300, doc.y, { continued: true })
          .text(`${total}/-`, 400);
      });

      doc.moveDown();

      /* =======================
         PRICE SUMMARY
      ======================== */
      const tax = order.taxAmount || 0;
      const shipping = order.shippingFee || 0;
      const total = subtotal + tax + shipping;

      doc
        .text(`Subtotal: ${subtotal}/-`, { align: "right" })
        .text(`Tax: ${tax}/-`, { align: "right" })
        .text(`Shipping: ${shipping}/-`, { align: "right" })
        .fontSize(14)
        .text(`Grand Total: ${total}/-`, { align: "right" });

      doc.moveDown();

      /* =======================
         FOOTER
      ======================== */
      doc
        .fontSize(10)
        .text("Thank you for your purchase!", { align: "center" })
        .text("For any queries, contact support@shopsphere.com", {
          align: "center",
        });

      doc.end();

      /* =======================
         STREAM EVENTS
      ======================== */
      stream.on("finish", () => {
        console.log("📄 Invoice saved:", filePath);
        resolve(filePath);
      });

      stream.on("error", (err) => {
        console.error("❌ PDF Write Error:", err);
        reject(err);
      });

    } catch (error) {
      console.error("❌ Invoice Generator Error:", error);
      reject(error);
    }
  });
};