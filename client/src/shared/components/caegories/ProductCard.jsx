import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";

export default function ProductCard({ product }) {

  const variant = product?.variants?.[0];
  const image = variant?.images?.[0]?.url;

  return (

    <Link
      to={`/product/${product.slug}/${product._id}`}
      className="bg-white border rounded-lg hover:shadow-lg transition group relative"
    >

      {/* WISHLIST */}
      <button
        onClick={(e) => e.preventDefault()}
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
      >
        <Heart size={16} />
      </button>

      {/* IMAGE */}
      <div className="h-44 flex items-center justify-center bg-gray-100 overflow-hidden">

        <img
          src={image ? `${API_URL}${image}` : ""}
          className="h-full object-contain group-hover:scale-105 transition"
        />

      </div>

      {/* DETAILS */}
      <div className="p-3 space-y-1">

        <h3 className="text-sm font-medium line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center text-xs">
          <span className="bg-green-600 text-white px-1 rounded mr-1">
            4.3
          </span>
          <span className="text-gray-500">(120)</span>
        </div>

        <div className="font-semibold">
          ₹{variant?.price}
        </div>

      </div>

    </Link>
  );
}