import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCategoryProductsQuery } from "../../../modules/categories/categoryApi";
import ProductCard from "./ProductCard";

export default function CategoryProductGrid({ categoryId, setTotal }) {
  const [searchParams] = useSearchParams();

  // ✅ Convert URL params to query object
  const query = Object.fromEntries([...searchParams]);

  // ✅ Only fetch if categoryId exists
  const { data, isLoading, isError } = useGetCategoryProductsQuery(
    categoryId ? { categoryId, ...query } : null
  );

  const products = data?.products || [];

  // ✅ Update total products for header or sort bar
  useEffect(() => {
    if (data?.total !== undefined) {
      setTotal(data.total);
    }
  }, [data, setTotal]);

  // ===== LOADING STATE =====
  if (!categoryId) {
    return <p className="p-4 text-gray-500">Select a category to view products</p>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 animate-pulse space-y-3">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (isError) {
    return <p className="text-red-500 p-4">Failed to load products</p>;
  }

  // ===== EMPTY STATE =====
  if (!products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-gray-500">Try changing filters or selecting a different category</p>
      </div>
    );
  }

  // ===== PRODUCTS GRID =====
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500 mb-3">
        Showing {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}