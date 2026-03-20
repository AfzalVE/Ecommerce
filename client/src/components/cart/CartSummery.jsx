import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const CartSummary = ({ subtotal }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-10">
      <h3 className="font-bold text-lg mb-4">
        Order Summary
      </h3>

      <div className="flex justify-between mb-4">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

<Link to="/checkout">
        <Button className="w-full" size="lg">
          <CreditCard className="mr-2" />
          Checkout (₹{subtotal.toFixed(2)})
        </Button>
      </Link>

      <p className="text-xs text-gray-500 text-center mt-2">
        Ships within 24 hours
      </p>
    </div>
  );
};

export default CartSummary;