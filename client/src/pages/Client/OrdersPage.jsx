import { useState } from "react";
import { useGetUserOrdersQuery } from "../features/orders/orderApi";
import Loader from "../components/ui/Loader";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown
} from "lucide-react";
import { API_URL } from "../utils/constants";

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
    <div className="bg-white rounded-xl shadow border hover:shadow-lg transition">

      {/* HEADER */}

      <div className="p-6 flex justify-between items-start">

        <div>
          <h3 className="font-bold text-lg text-indigo-600">
            {order.orderNumber}
          </h3>

          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${statusColors[status.color]}`}
        >
          <StatusIcon size={16} />
          {status.label}
        </div>

      </div>

      {/* SUMMARY */}

      <div className="px-6 pb-6 grid grid-cols-2 text-sm">

        <div>
          <p className="text-gray-500">Items</p>
          <p className="font-semibold">
            {order.items.length}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500">Total</p>
          <p className="font-bold text-indigo-600">
            ₹{order.finalAmount.toFixed(2)}
          </p>
        </div>

      </div>

      {/* BUTTON */}

      <div className="px-6 pb-6">

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-indigo-600 font-medium"
        >
          {expanded ? "Hide Details" : "View Details"}
          <ChevronDown
            size={18}
            className={`transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>

      </div>

      {/* EXPANDABLE DETAILS */}

      {expanded && (
        <div className="border-t bg-gray-50 p-6">

          <h4 className="font-semibold mb-4">
            Order Items
          </h4>

          <div className="space-y-3">

            {order.items.map((item, idx) => (

              <div
                key={idx}
                className="flex items-center gap-4 bg-white p-3 rounded-lg border"
              >

                <img
                  src={`${API_URL}${item.image}`}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />

                <div className="flex-1">

                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.color} / {item.size}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold">
                    ₹{(item.finalPrice * item.quantity).toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* ADDRESS */}

          <div className="mt-6 pt-4 border-t text-sm">

            <h4 className="font-semibold mb-2">
              Shipping Address
            </h4>

            <p>{order.address.name}</p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city},{" "}
              {order.address.state}
            </p>
            <p>{order.address.postalCode}</p>
            <p>{order.address.phone}</p>

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

        <div className="flex items-center gap-3 mb-10">

          <Package className="w-10 h-10 text-indigo-600" />

          <div>
            <h1 className="text-3xl font-bold">
              My Orders
            </h1>

            <p className="text-gray-500">
              Track your purchases
            </p>
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="text-center py-20">

            <Package
              size={80}
              className="mx-auto text-gray-300 mb-4"
            />

            <h2 className="text-xl font-semibold">
              No orders yet
            </h2>

            <p className="text-gray-500 mb-6">
              Your orders will appear here
            </p>

            <a
              href="/products"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
            >
              Start Shopping
            </a>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <OrderCard
                key={order._id}
                order={order}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default OrdersPage;