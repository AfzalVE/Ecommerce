import { useState, useEffect } from "react";
import {
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useCancelOrderMutation,
} from "../../modules/orders/admin/orderApi";
import { format } from "date-fns";
import SearchBar from "../../shared/components/layout/SearchBar";

const STATUS_COLORS = {
    pending: "bg-yellow-200 text-yellow-800",
    confirmed: "bg-blue-200 text-blue-800",
    shipped: "bg-indigo-200 text-indigo-800",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
};

const PAYMENT_COLORS = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
};

const Order = () => {
    // Pagination
    const [page, setPage] = useState(1);
    const limit = 10;

    // Filters
    const [orderStatusFilter, setOrderStatusFilter] = useState("");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // RTK Query with parameters: pagination + filters + search
    const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({
        page,
        limit,
        search: searchQuery,
        orderStatus: orderStatusFilter,
        paymentStatus: paymentStatusFilter,
    });

    const orders = data?.orders || [];
    const totalPages = data?.totalPages || 1;

    // Mutations
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [updatePayment] = useUpdatePaymentStatusMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const handleStatusChange = async (id, status) => await updateStatus({ id, status });
    const handlePaymentChange = async (id, paymentStatus) => await updatePayment({ id, paymentStatus });
    // const handleCancelOrder = async (id) => {
    //     if (confirm("Are you sure you want to cancel this order?")) await cancelOrder(id);
    // };

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePageSelect = (pageNum) => setPage(pageNum);

    // Reset page when filters or search change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, orderStatusFilter, paymentStatusFilter]);

    if (isLoading) return <p className="text-center mt-10">Loading orders...</p>;
    if (isError) return <p className="text-center mt-10 text-red-600">Failed to load orders.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

            {/* Search Bar */}
            <SearchBar
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                fetchSuggestions={async (q) => {
                    if (!q) return [];
                    const res = await fetch(
                        `/admin/orders/search?q=${encodeURIComponent(q)}&page=1&limit=10`,
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        }
                    );
                    const data = await res.json();
                    return data.orders || [];
                }}
                onSelect={(order) => console.log("Selected order:", order)}
                placeholder="Search orders by #, user name or email..."
            />

            {/* Filters */}
            <div className="flex gap-4 mb-4 mt-2">
                <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Status</option>
                    {Object.keys(STATUS_COLORS).map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Payment</option>
                    {Object.keys(PAYMENT_COLORS).map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Order #</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Payment</th>
                            <th className="p-3 text-left">Payment Mode</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-sm">{order.orderNumber}</td>
                                <td className="p-3 text-sm">
                                    <div>{order.user?.name || "N/A"}</div>
                                    <div className="text-gray-500 text-xs">{order.user?.email || "N/A"}</div>
                                </td>
                                <td className="p-3 font-semibold">₹{order.totalAmount}</td>
                                <td className="p-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`p-1 rounded ${STATUS_COLORS[order.status]}`}
                                    >
                                        {Object.keys(STATUS_COLORS).map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    <select
                                        value={order.paymentStatus}
                                        onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                                        className={`p-1 rounded ${PAYMENT_COLORS[order.paymentStatus]}`}
                                    >
                                        {Object.keys(PAYMENT_COLORS).map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    {order.paymentMethod
                                        ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)
                                        : "N/A"}
                                </td>
                                <td className="p-3 text-sm">{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</td>
                                <td className="p-3">
                                    {order.invoicePath && (
                                        <a
                                            href={`/api/admin/orders/${order._id}/invoice`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        >
                                            Invoice
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Order;