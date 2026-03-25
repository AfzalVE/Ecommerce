import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../../modules/cart/cartApi";
import { Star } from "lucide-react";

export default function ProductDetails({ product }) {
  const navigate = useNavigate();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size);
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color);

  const sizes = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Set(product.variants.map(v => v.color))];

  const variant = useMemo(() => {
    return product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
  }, [selectedSize, selectedColor, product.variants]);

  const handleAddToCart = async () => {
    if (!variant) {
      toast.error("Variant not available");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        variantId: variant._id,
        quantity: 1
      }).unwrap();

      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    }
  };
  const handleBuyNow = async () => {
    if (!variant) {
      toast.error("Variant not available");
      return;
    }

    try {
      // ✅ Add to cart first
      await addToCart({
        productId: product._id,
        variantId: variant._id,
        quantity: 1
      }).unwrap();

      // ✅ Redirect to checkout
      navigate("/checkout");

    } catch {
      toast.error("Something went wrong");
    }
  };
  return (

    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
        {product.title}
      </h1>

      {/* RATING */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm">
          4.3 <Star size={14} className="ml-1 fill-white" />
        </div>
        <span className="text-gray-500 text-sm">(120 reviews)</span>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-3">

        <span className="text-3xl font-bold text-gray-900">
          ₹{variant?.price}
        </span>

        <span className="text-gray-400 line-through">
          ₹{variant?.price + 300}
        </span>

        <span className="text-green-600 font-semibold">
          25% off
        </span>

      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* SIZE */}
      <div>
        <p className="font-semibold mb-2">Select Size</p>

        <div className="flex flex-wrap gap-3">

          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition
                ${selectedSize === size
                  ? "border-black bg-black text-white"
                  : "hover:border-black hover:bg-gray-100"}
              `}
            >
              {size}
            </button>
          ))}

        </div>
      </div>

      {/* COLOR */}
      <div>
        <p className="font-semibold mb-2">Color</p>

        <div className="flex gap-3">

          {colors.map(color => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full cursor-pointer border-2 transition
                ${selectedColor === color
                  ? "border-black scale-110"
                  : "border-gray-300"}
              `}
              style={{ backgroundColor: color }}
            />
          ))}

        </div>
      </div>

      {/* STOCK */}
      <div>
        {variant?.stock > 0 ? (
          <p className="text-green-600 font-medium">
            ✅ In Stock ({variant.stock} items left)
          </p>
        ) : (
          <p className="text-red-500 font-medium">
            ❌ Out of Stock
          </p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 pt-4">

        <button
          onClick={handleAddToCart}
          disabled={!variant || variant.stock === 0 || isLoading}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!variant || variant.stock === 0}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          Buy Now
        </button>

      </div>

    </div>
  );
}