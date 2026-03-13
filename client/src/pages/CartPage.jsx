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
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={32} />
        <h1 className="text-3xl font-bold">
          Shopping Cart
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList
            items={items}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />

          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={handleClear}
          >
            Clear Cart
          </Button>
        </div>

        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
};

export default CartPage;