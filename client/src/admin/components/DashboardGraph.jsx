// components/admin/DashboardGraph.jsx

import { useState } from "react";
import {
  useGetItemsAddedGraphQuery,
  useGetItemsSoldGraphQuery,
  useGetProfitGraphQuery,
  useGetTotalSoldGraphQuery,
} from "../../modules/dashboard/admin/dashboardApi";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const filters = ["daily", "weekly", "monthly", "yearly"];

const COLORS = {
  added: "#6366F1",
  sold: "#22C55E",
  profit: "#F59E0B",
  total: "#3B82F6",
};

export default function DashboardGraph({
  products = [],
  categories = [],
}) {
  const [filter, setFilter] = useState("monthly");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 📡 API CALLS (UPDATED)
  const { data: addedData } = useGetItemsAddedGraphQuery({
    filter,
    categoryId: selectedCategory || undefined,
  });

  const { data: soldData } = useGetItemsSoldGraphQuery({
    filter,
    productId: selectedProduct || undefined,
    categoryId: selectedCategory || undefined,
  });

  const { data: profitData } = useGetProfitGraphQuery(filter);

  const { data: totalSoldData } = useGetTotalSoldGraphQuery({
    filter,
    categoryId: selectedCategory || undefined,
  });

  // 🧠 FORMATTER (UPDATED FOR BACKEND)
  const formatData = (data, key) =>
    data?.data?.map((item) => ({
      name: item._id,
      value: item[key] ?? 0,
      productName: item.productName || "All Products",
    })) || [];

  const renderEmpty = () => (
    <div className="text-gray-400 text-center py-10">
      No data available
    </div>
  );

  // 🎯 TOOLTIP (FIXED)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white border rounded shadow p-3">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-semibold">{d.productName}</p>
          <p className="text-indigo-600 font-bold">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">

      {/* 🔥 CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">

        {/* FILTER */}
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}

        {/* CATEGORY FILTER */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* PRODUCT FILTER */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border px-3 py-1 rounded ml-auto"
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* 📈 ITEMS ADDED */}
      <GraphCard title="Items Added">
        {formatData(addedData, "count").length === 0 ? renderEmpty() : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={formatData(addedData, "count")}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                dataKey="value"
                stroke={COLORS.added}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </GraphCard>

      {/* 📊 ITEMS SOLD */}
      <GraphCard title="Items Sold">
        {formatData(soldData, "totalSold").length === 0 ? renderEmpty() : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={formatData(soldData, "totalSold")}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={COLORS.sold} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GraphCard>

      {/* 💰 PROFIT */}
      <GraphCard title="Profit">
        {formatData(profitData, "profit").length === 0 ? renderEmpty() : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={formatData(profitData, "profit")}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(v) => `₹ ${v}`}
              />
              <Line
                dataKey="value"
                stroke={COLORS.profit}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </GraphCard>

      {/* 📦 TOTAL SOLD */}
      <GraphCard title="Top Selling Products">
        {formatData(totalSoldData, "totalSold").length === 0 ? renderEmpty() : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={formatData(totalSoldData, "totalSold")}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={COLORS.total} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GraphCard>

    </div>
  );
}

// 📦 CARD
function GraphCard({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        {title}
      </h3>
      <div className="bg-gray-50 p-4 rounded-xl">
        {children}
      </div>
    </div>
  );
}