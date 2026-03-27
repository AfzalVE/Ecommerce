import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetUserOrdersQuery } from "../../modules/orders/client/orderApi";
import Loader from "../../shared/components/ui/Loader";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  CreditCard,
  Download
} from "lucide-react";
import Pagination from "../../shared/components/ui/Pagination";
import { API_URL } from "../../shared/utils/constants";

/* ==============================
   STATUS CONFIG
============================== */
const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "orange" },
  confirmed: { label: "Confirmed", icon: Package, color: "blue" },
  shipped: { label: "Shipped", icon: Package, color: "purple" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "green" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "red" }
};

const paymentConfig = {
  pending: { label: "Pending", color: "orange" },
  paid: { label: "Paid", color: "green" },
  failed: { label: "Failed", color: "red" }
};

const statusColors = {
  orange: "bg-orange-50 text-orange-700",
  blue: "bg-blue-50 text-blue-700",
  purple: "bg-purple-50 text-purple-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700"
};

/* ==============================
   ORDER CARD
============================== */
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const status = statusConfig[order.status] || statusConfig.pending;
  const payment = paymentConfig[order.paymentStatus] || paymentConfig.pending;

  const StatusIcon = status.icon;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-xl transition overflow-hidden">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <div>
          <h3 className="font-semibold text-lg text-indigo-600">
            {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Order Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[status.color]}`}
          >
            <StatusIcon size={14} />
            {status.label}
          </div>

          {/* Payment Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.color]}`}
          >
            <CreditCard size={12} />
            {payment.label}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="p-6 flex justify-between items-center">
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500">Items</p>
            <p className="font-semibold">{order.items.length}</p>
          </div>

          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-bold text-indigo-600 text-lg">
              ₹{order.finalAmount?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Payment</p>
            <p className="font-medium capitalize">
              {order.paymentMethod || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* Invoice Download */}
          {order.invoicePath && (
            <a
              href={`${API_URL}/orders/${order._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download size={16} />
              Invoice
            </a>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
          >
            {expanded ? "Hide" : "Details"}
            <ChevronDown
              size={18}
              className={`transition ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* DETAILS */}
      {expanded && (
        <div className="bg-gray-50 px-6 py-6 space-y-6">
          {/* ITEMS */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-700">
              Order Items
            </h4>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl border"
                >
                  <img
                    src={`${API_URL}${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.color} • {item.size}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{(item.finalPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-4 rounded-xl border">
            <h4 className="font-semibold mb-2">Shipping Address</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">{order.address?.name}</p>
              <p>{order.address?.street}</p>
              <p>
                {order.address?.city}, {order.address?.state}
              </p>
              <p>{order.address?.postalCode}</p>
              <p>{order.address?.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==============================
   ORDERS PAGE
============================== */
const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const statusFilter = searchParams.get("status") || "";

  const { data, isLoading, error } = useGetUserOrdersQuery({
    page,
    limit: 10,
    status: statusFilter
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  const changeStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);

    if (status) params.set("status", status);
    else params.delete("status");

    params.set("page", "1");
    setSearchParams(params);
  };

  if (isLoading) return <Loader className="py-20" />;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load orders
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-10 h-10 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-500">
              Track your purchases & download invoices
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => changeStatusFilter("")}
            className={`px-4 py-1 rounded border ${
              !statusFilter ? "bg-indigo-500 text-white" : ""
            }`}
          >
            All
          </button>

          {Object.keys(statusConfig).map((status) => (
            <button
              key={status}
              onClick={() => changeStatusFilter(status)}
              className={`px-4 py-1 rounded border ${
                statusFilter === status
                  ? "bg-indigo-500 text-white"
                  : ""
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border">
            <Package size={70} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold">No orders found</h2>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;