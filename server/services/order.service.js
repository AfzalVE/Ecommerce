import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"; // ✅ FIXED
import Razorpay from "razorpay";
import crypto from "crypto";
import { addEmailJob } from "../queues/email.queue.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrderService = async ({ user, body }) => {

  const { address, paymentMethod } = body;

  /* =========================
     VALIDATION
  ========================== */

  if (!address || !address.name || !address.phone) {
    throw new Error("Invalid shipping address");
  }

  if (!["cod", "razorpay"].includes(paymentMethod)) {
    throw new Error("Invalid payment method");
  }

  /* =========================
     GET USER CART
  ========================== */

  const cart = await Cart
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  /* =========================
     CALCULATE TOTALS
  ========================== */

  let totalAmount = 0;
  let discountAmount = 0;

  const processedItems = cart.items.map((item) => {

    const product = item.product;

    const variant = product.variants.find(
      v => v._id.toString() === item.variantId.toString()
    );

    if (!variant) {
      throw new Error("Product variant not found");
    }

    const price = variant.price;
    const discount = variant.discount || 0;
    const finalPrice = variant.finalPrice || price;

    totalAmount += price * item.quantity;
    discountAmount += discount * item.quantity;

    return {
      productId: product._id,
      variantId: item.variantId,
      name: product.title,
      color: variant.color,
      size: variant.size,
      price,
      quantity: item.quantity,
      discount,
      finalPrice,
      image: variant.images?.[0]?.url
    };

  });

  const finalAmount = totalAmount - discountAmount;

  if (finalAmount <= 0) {
    throw new Error("Invalid order amount");
  }

  /* =========================
     GENERATE ORDER NUMBER
  ========================== */

  const orderNumber = "ORD-" + crypto.randomBytes(6).toString("hex");

  /* =========================
     CREATE ORDER
  ========================== */

  const order = await Order.create({
    orderNumber,
    user: user._id,
    items: processedItems,
    totalAmount,
    discountAmount,
    finalAmount,
    address,
    paymentMethod,

    // ✅ FIXED (important)
    paymentStatus: "pending",
    status: "pending"
  });

  /* =========================
     CLEAR CART
  ========================== */

  cart.items = [];
  await cart.save();

  /* =========================
     COD FLOW
  ========================== */

  if (paymentMethod === "cod") {

    // ✅ Reduce stock immediately
    for (const item of processedItems) {

      const product = await Product.findById(item.productId);

      if (!product) continue;

      const variant = product.variants.find(
        v => v._id.toString() === item.variantId.toString()
      );

      if (variant) {
        console.log(`Reducing stock for product ${product.title}, variant ${variant.color} ${variant.stock} by ${item.quantity}`);
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }

      await product.save();
    }

    await addEmailJob({
      orderId: order._id
    });

    return {
      success: true,
      order
    };
  }

  /* =========================
     RAZORPAY FLOW
  ========================== */

  let razorpayOrder;

  try {

    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: {
        orderId: order._id.toString()
      }
    });

  } catch (error) {

    console.error("Razorpay Error:", error);
    throw new Error("Payment gateway error");
  }

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    success: true,
    order,
    razorpayOrder
  };
};