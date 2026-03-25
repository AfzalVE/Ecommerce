import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { Star } from "lucide-react";
import { useAddToCartMutation } from "../../../modules/cart/cartApi";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {

  const [addToCart, { isLoading }] = useAddToCartMutation();

  const variant = product.variants?.[0];
  const image = variant?.images?.[0]?.url;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // 🔥 prevent redirect

    try {
      await addToCart({
        productId: product._id,
        variantId: variant._id,
        quantity: 1
      }).unwrap();

      toast.success("Added to cart 🛒");

    } catch {
      toast.error("Failed to add");
    }
  };

  return (

    <Link
      to={`/product/${product.slug}/${product._id}`}
      className="group bg-white border rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
    >

      {/* IMAGE */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">

        <img
          src={image ? `${API_URL}${image}` : "https://via.placeholder.com/300"}
          className="h-full object-contain group-hover:scale-110 transition duration-300"
        />

        {/* DISCOUNT */}
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
          20% OFF
        </span>

      </div>

      {/* DETAILS */}
      <div className="p-3 space-y-2">

        {/* TITLE */}
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-indigo-600">
          {product.title}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded">
            4.3 <Star size={12} className="ml-1 fill-white" />
          </span>
          <span className="text-gray-500">(120)</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            ₹{variant?.price}
          </span>
          <span className="text-gray-400 line-through text-xs">
            ₹{variant?.price + 200}
          </span>
        </div>

      </div>

      {/* ADD TO CART (HOVER) */}
      <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition">

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>

      </div>

    </Link>
  );
}