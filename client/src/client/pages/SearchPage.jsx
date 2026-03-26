import { useLocation } from "react-router-dom";
import { useGetProductsQuery } from "../../modules/products/productApi";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const keyword = query.get("q") || "";

  // 🔥 Call backend with search keyword
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Error loading products</h2>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Results for "{keyword}"
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.products?.length > 0 ? (
          data.products.map((product) => (
            <div key={product._id} className="border p-3 rounded">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}