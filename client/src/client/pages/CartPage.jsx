import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../../shared/components/ui/Loader";
import Button from "../../shared/components/ui/Button";

import CartList from "../../shared/components/cart/CartList";
import CartSummary from "../../shared/components/cart/CartSummery";
import { useCart } from "../../shared/hooks/useCart";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    items,
    subtotal,
    isLoading,
    error,
    removeItem,
    updateItem,
    clearCart
  } = useCart();

  const handleRemove = async (id) => {
    await removeItem(id).unwrap();
    toast.success("Item removed");
  };

  const handleUpdate = async (id, qty) => {
    await updateItem({ itemId: id, quantity: qty }).unwrap();
  };

  const handleClear = async () => {
    await clearCart().unwrap();
    toast.success("Cart cleared");
  };

  if (isLoading) return <Loader className="py-20" />;

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load cart
      </div>
    );

  /* EMPTY STATE */
  if (!items.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">

        <ShoppingCart size={80} className="text-gray-300 mb-6" />

        <h2 className="text-2xl font-semibold mb-2">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <Link to="/">
          <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold">
            Continue Shopping
          </button>
        </Link>

      </div>
    );

  return (

    <div className="bg-gray-100 min-h-screen py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          My Cart ({items.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            <div className="bg-white rounded-lg shadow-sm p-4">

              <CartList
                items={items}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />

            </div>

            {/* CLEAR CART */}
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className="text-red-500 font-medium hover:underline"
              >
                Clear Cart
              </button>
            </div>

          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">

              <h2 className="text-lg font-semibold border-b pb-3">
                Price Details
              </h2>

              <CartSummary subtotal={subtotal} />

              <Link to="/checkout">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold">
                  Proceed to Checkout
                </button>
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;