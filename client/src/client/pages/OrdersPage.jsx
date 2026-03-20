import { useState } from "react";
import { useGetUserOrdersQuery } from "../../modules/orders/orderApi";
import Loader from "../../shared/components/ui/Loader";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown
} from "lucide-react";
import { API_URL } from "../../shared/utils/constants";

/* ==============================
   ORDER STATUS CONFIG
============================== */

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "orange" },
  confirmed: { label: "Confirmed", icon: Package, color: "blue" },
  shipped: { label: "Shipped", icon: Package, color: "purple" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "green" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "red" }
};

const statusColors = {
  orange: "bg-orange-50 text-orange-700",
  blue: "bg-blue-50 text-blue-700",
  purple: "bg-purple-50 text-purple-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700"
};

/* ==============================
   ORDER CARD COMPONENT
============================== */
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 overflow-hidden">

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

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[status.color]}`}
        >
          <StatusIcon size={14} />
          {status.label}
        </div>

      </div>

      {/* SUMMARY */}
      <div className="p-6 flex justify-between items-center">

        <div className="flex gap-6 text-sm">

          <div>
            <p className="text-gray-500">Items</p>
            <p className="font-semibold">
              {order.items.length}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-bold text-indigo-600 text-lg">
              ₹{order.finalAmount.toFixed(2)}
            </p>
          </div>

        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
        >
          {expanded ? "Hide Details" : "View Details"}
          <ChevronDown
            size={18}
            className={`transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>

      </div>

      {/* DETAILS */}
      {expanded && (
        <div className="bg-gray-50 px-6 py-6 space-y-6">

          {/* PRODUCTS */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-700">
              Order Items
            </h4>

            <div className="space-y-4">

              {order.items.map((item, idx) => (

                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl border hover:shadow-sm transition"
                >

                  {/* IMAGE */}
                  <img
                    src={`${API_URL}${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">

                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.color} • {item.size}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  {/* PRICE */}
                  <div className="text-right">

                    <p className="font-semibold text-gray-800">
                      ₹{(item.finalPrice * item.quantity).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-400">
                      ₹{item.finalPrice} each
                    </p>

                  </div>

                </div>

              ))}

            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-4 rounded-xl border">

            <h4 className="font-semibold mb-2 text-gray-700">
              Shipping Address
            </h4>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">
                {order.address.name}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}
              </p>
              <p>{order.address.postalCode}</p>
              <p>{order.address.phone}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
/* ==============================
   MAIN PAGE
============================== */

const OrdersPage = () => {

  const { data, isLoading, error } =
    useGetUserOrdersQuery();

  const orders = data?.orders || [];

  if (isLoading) {
    return <Loader className="py-20" />;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load orders
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-50 py-12 px-4">

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div className="flex items-center gap-3">
          <Package className="w-10 h-10 text-indigo-600" />

          <div>
            <h1 className="text-3xl font-bold">
              My Orders
            </h1>
            <p className="text-gray-500">
              Track, manage and review your purchases
            </p>
          </div>
        </div>

      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border">

          <Package size={70} className="mx-auto text-gray-300 mb-4" />

          <h2 className="text-xl font-semibold">
            No orders yet
          </h2>

          <p className="text-gray-500 mb-6">
            Looks like you haven’t placed any orders
          </p>

          <a
            href="/products"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Start Shopping
          </a>

        </div>
      ) : (

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

      )}

    </div>

  </div>
);

};

export default OrdersPage;