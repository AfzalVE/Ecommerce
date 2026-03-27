import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetFilteredProductsQuery } from "../../../modules/products/client/productApi";
import ProductCard from "./ProductCard";
import Pagination from "../ui/Pagination";

export default function CategoryProductGrid({ categoryId, setTotal }) {
  const [searchParams] = useSearchParams();

  // Convert URL params → object
  const queryParams = Object.fromEntries([...searchParams]);

  // Parse page as number
  const pageNumber = Number(queryParams.page) || 1;

  // FINAL QUERY
  const finalQuery = {
    ...queryParams,
    ...(categoryId ? { category: categoryId } : {}),
    page: pageNumber,
    limit: 5, // limit to 5 products per page
  };

  const { data, isLoading, isError } = useGetFilteredProductsQuery(finalQuery);
  const products = data?.products || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / finalQuery.limit);

  useEffect(() => {
    setTotal(total);
  }, [total, setTotal]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-3 animate-pulse space-y-3"
          >
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 p-4">Failed to load products</p>;
  }

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-gray-500">
          Try changing filters or selecting a different category
        </p>
      </div>
    );
  }

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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={pageNumber} totalPages={totalPages} />
      )}
    </div>
  );
}