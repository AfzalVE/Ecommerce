import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetProductsQuery } from "../../modules/products/productApi";
import { useGetCategoriesQuery } from "../../modules/categories/categoryApi";

import ProductList from "./ProductList";
import CategoryList from "../../modules/categories/CategoryList";

export default function Dashboard() {

  const [view, setView] = useState("products");

  const { data: productData } = useGetProductsQuery();
  const { data: categoryData } = useGetCategoriesQuery();

  const products = productData?.products || [];
  const categories = categoryData?.categories || [];

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Admin Dashboard
      </h1>

      {/* QUICK ACTIONS */}

      <div className="flex gap-4 mb-10">

        <Link
          to="/admin/products/add"
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg shadow hover:bg-indigo-700"
        >
          + Add Product
        </Link>

        <Link
          to="/admin/categories/add"
          className="bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700"
        >
          + Add Category
        </Link>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Products</h2>
          <p className="text-3xl font-bold mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Categories</h2>
          <p className="text-3xl font-bold mt-2">
            {categories.length}
          </p>
        </div>

      </div>

      {/* TOGGLE SWITCH */}

      <div className="flex gap-4 mb-8">

        <button
          onClick={() => setView("products")}
          className={`px-4 py-2 rounded-lg ${
            view === "products"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setView("categories")}
          className={`px-4 py-2 rounded-lg ${
            view === "categories"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Categories
        </button>

      </div>

      {/* CONDITIONAL RENDER */}

      {view === "products" && (
        <ProductList products={products} />
      )}

      {view === "categories" && (
        <CategoryList categories={categories} />
      )}

    </div>

  );
}