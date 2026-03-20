import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../../features/cart/cartApi";

export default function ProductDetails({ product }) {

  const [addToCart] = useAddToCartMutation();

  // Initial selections
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size);
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color);

  // Unique options
  const sizes = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Set(product.variants.map(v => v.color))];

  // Find selected variant
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

      toast.success("Added to cart!");

    } catch (error) {

      toast.error("Failed to add to cart");

    }
  };

  return (

    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold">
        {product.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-600">
        {product.description}
      </p>

      {/* PRICE */}
      <p className="text-2xl font-semibold">
        ₹ {variant?.price}
      </p>

      {/* SIZE SELECTOR */}
      <div>

        <p className="font-semibold mb-2">Select Size</p>

        <div className="flex gap-3">

          {sizes.map(size => (

            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border px-4 py-2 rounded-lg transition
                ${selectedSize === size
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"}
              `}
            >
              {size}
            </button>

          ))}

        </div>

      </div>

      {/* COLOR SELECTOR */}
      <div>

        <p className="font-semibold mb-2">Color</p>

        <div className="flex gap-3">

          {colors.map(color => (

            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border cursor-pointer 
              ${selectedColor === color ? "ring-2 ring-black" : ""}`}
              style={{ background: color }}
            />

          ))}

        </div>

      </div>

      {/* STOCK */}
      <p className="text-sm text-gray-500">

        {variant?.stock > 0
          ? `${variant.stock} in stock`
          : "Out of stock"}

      </p>

      {/* ADD TO CART */}
      <button
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        onClick={handleAddToCart}
        disabled={!variant || variant.stock === 0}
      >

        {variant?.stock === 0
          ? "Out of Stock"
          : "Add To Cart"}

      </button>

    </div>

  );
}