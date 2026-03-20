import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";

import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummery";
import { useCart } from "../features/hooks/useCart";

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

  if (!items.length)
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <ShoppingCart className="mx-auto mb-4 opacity-40" size={80} />

        <h2 className="text-2xl font-bold mb-4">
          Your cart is empty
        </h2>

        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-rose-50 to-orange-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 bg-white/70 backdrop-blur-xl px-10 py-6 rounded-3xl shadow-2xl border border-white/50 mb-6">
            <ShoppingCart className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-3xl shadow-xl" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
                Shopping Cart
              </h1>
              <p className="text-xl text-gray-600 font-medium">Review your selected items</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <CartList
                items={items}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            </div>
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-transparent shadow-xl hover:shadow-2xl transition-all duration-300 py-4 px-8 rounded-2xl text-lg font-semibold"
              onClick={handleClear}
            >
              Clear Cart
            </Button>
          </div>

          <div className="lg:sticky lg:top-24">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;