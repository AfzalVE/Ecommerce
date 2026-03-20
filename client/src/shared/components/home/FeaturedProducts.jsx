import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../../modules/products/productApi";
import { API_URL } from "../../utils/constants";

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useGetProductsQuery();

  const products = data?.products || [];

  if (isLoading) {
    return (
      <section className="py-20 text-center">
        <p className="text-lg animate-pulse">Loading amazing products...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 text-center">
        <p className="text-red-500 text-lg">
          Something went wrong while loading products.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Products
          </h2>

          <Link
            to="/products"
            className="text-indigo-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {products.map((product) => {
            const firstVariant = product?.variants?.[0];
            const image = firstVariant?.images?.[0]?.url;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 group overflow-hidden"
              >
                {/* IMAGE */}
                <Link to={`/product/${product.slug}/${product._id}`}>
                  <div className="relative w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">

                    <img
                      src={
                        image
                          ? `${API_URL}${image}`
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={product.title}
                      className="object-contain h-full w-full group-hover:scale-110 transition duration-500"
                    />

                    {/* BADGE */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      SALE
                    </span>
                  </div>
                </Link>

                {/* DETAILS */}
                <div className="p-4">

                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {product.title}
                  </h3>

                  {/* RATING */}
                  <div className="text-yellow-500 text-sm mb-2">
                    ⭐ 4.5 (120)
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-indigo-600 font-bold text-lg">
                      ₹{firstVariant?.price || 0}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      ₹{(firstVariant?.price || 0) + 200}
                    </span>
                  </div>

                  {/* ACTION */}
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}