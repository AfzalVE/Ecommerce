import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../../modules/products/productApi";
import { API_URL } from "../../utils/constants";
import { useAddToCartMutation } from "../../../modules/cart/cartApi";
import toast from "react-hot-toast";

export default function FeaturedProducts() {
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { data, isLoading, isError } = useGetProductsQuery();

  const products = data?.products || [];

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // ❗ prevent redirect
    e.preventDefault();  // ❗ prevent Link navigation

    const firstVariant = product?.variants?.[0];

    if (!firstVariant) {
      return toast.error("No variant available");
    }

    try {
      await addToCart({
        productId: product._id,
        variantId: firstVariant._id,
        quantity: 1,
      }).unwrap();

      toast.success("🛒 Added to cart");

    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

          {products.map((product) => {
            const firstVariant = product?.variants?.[0];
            const image = firstVariant?.images?.[0]?.url;

            return (
              <Link
                to={`/product/${encodeURIComponent(product.title)}/${product._id}`}
                key={product._id}
                className="bg-white border rounded-lg hover:shadow-md transition group block"
              >
                {/* IMAGE */}
                <div className="h-40 flex items-center justify-center bg-gray-100 relative">

                  <img
                    src={image ? `${API_URL}${image}` : "https://via.placeholder.com/300"}
                    className="h-full object-contain group-hover:scale-105 transition"
                  />

                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    20% OFF
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-3">

                  <h3 className="text-sm font-medium line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center text-xs mt-1">
                    <span className="bg-green-600 text-white px-1 rounded mr-1">4.3</span>
                    <span className="text-gray-500">(120)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold">
                      ₹{firstVariant?.price}
                    </span>
                    <span className="line-through text-gray-400 text-xs">
                      ₹{firstVariant?.price + 200}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding}
                    className="mt-3 w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}