import Order from "../../models/order.model.js";

// ==============================
// GET ALL ORDERS (with search + filters)
// ==============================
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", orderStatus = "", paymentStatus = "" } = req.query;
    const skip = (page - 1) * limit;

    const matchStage = {};
    if (orderStatus) matchStage.status = orderStatus;
    if (paymentStatus) matchStage.paymentStatus = paymentStatus;

    // Build regex for search
    const regex = search
      ? new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i")
      : null;

    let pipeline = [
      { $match: matchStage },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
    ];

    if (regex) {
      pipeline.push({
        $match: {
          $or: [
            { orderNumber: regex },
            { "user.name": regex },
            { "user.email": regex },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          user: { name: 1, email: 1 },
          orderNumber: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          createdAt: 1,
          invoicePath: 1,
        },
      }
    );

    const orders = await Order.aggregate(pipeline);

    // Total count for pagination
    let countPipeline = [{ $match: matchStage }];
    if (regex) {
      countPipeline.push(
        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        {
          $match: {
            $or: [
              { orderNumber: regex },
              { "user.name": regex },
              { "user.email": regex },
            ],
          },
        }
      );
    }
    countPipeline.push({ $count: "total" });
    const totalAgg = await Order.aggregate(countPipeline);
    const totalOrders = totalAgg[0]?.total || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({ success: true, orders, page: parseInt(page), totalPages, totalOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// UPDATE ORDER STATUS
// ==============================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// DELETE ORDER
// ==============================
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};