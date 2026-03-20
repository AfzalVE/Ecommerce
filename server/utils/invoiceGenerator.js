import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (order) => {

  return new Promise((resolve, reject) => {

    try {

      const invoiceDir = path.join(process.cwd(), "invoices");

      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir);
        console.log("📁 Created invoices folder");
      }

      const filePath = path.join(
        invoiceDir,
        `${order.orderNumber}.pdf`
      );

      const doc = new PDFDocument();

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      /* =======================
         INVOICE CONTENT
      ======================== */

      doc.fontSize(22).text("Invoice", { align: "center" });

      doc.moveDown();

      doc.fontSize(12).text(`Order: ${order.orderNumber}`);
      doc.text(`Customer: ${order.address.name}`);
      doc.text(`Email: ${order.address.email}`);
      doc.text(`Total: ₹${order.finalAmount}`);

      doc.moveDown();

      doc.text("Items:");

      order.items.forEach((item) => {

        doc.text(
          `${item.name} | Qty: ${item.quantity} | ₹${item.finalPrice}`
        );

      });

      doc.end();

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