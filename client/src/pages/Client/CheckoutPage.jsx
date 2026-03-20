import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/hooks/useCart";
import { useCreateOrderMutation } from "../features/orders/orderApi";

import useAuth from "../hooks/useAuth";

import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";

import toast from "react-hot-toast";

import { Truck, CreditCard, IndianRupee } from "lucide-react";

import { RAZORPAY_KEY } from "../utils/constants";

const CheckoutPage = () => {

  const navigate = useNavigate();

  const { items, subtotal, isLoading: cartLoading } = useCart();

  const { user } = useAuth();

  const [createOrder] = useCreateOrderMutation();

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [address, setAddress] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  /* LOAD RAZORPAY SCRIPT */

  const loadRazorpay = () =>
    new Promise((resolve) => {

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });

  /* CHECKOUT */

  const handleCheckout = async (e) => {

    e.preventDefault();

    if (items.length === 0) {
      return toast.error("Cart is empty");
    }

    try {

      setLoading(true);

      const order = await createOrder({
        address,
        paymentMethod
      }).unwrap();

      /* COD ORDER */

      if (paymentMethod === "cod") {

        toast.success("Order placed successfully");

        navigate("/orders");
        return;
      }

      /* RAZORPAY PAYMENT */

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        toast.error("Payment gateway failed to load");
        return;
      }

      const options = {

        key: RAZORPAY_KEY,

        amount: order.razorpayOrder.amount,

        currency: "INR",

        name: "ShopSphere",

        description: "Secure Payment",

        order_id: order.razorpayOrder.id,

        // ✅ IMPORTANT: NO verification here
        handler: function () {

          toast.success("Payment received. Confirming...");

          // webhook will update backend
          navigate("/orders");
        },

        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone
        },

        theme: {
          color: "#6366f1"
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

    } catch (error) {

      toast.error(error?.data?.message || "Checkout failed");

    } finally {

      setLoading(false);

    }

  };

  if (cartLoading) {
    return <Loader className="py-20" />;
  }

  return (

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* ADDRESS FORM */}

        <form
          onSubmit={handleCheckout}
          className="bg-white p-8 rounded-xl shadow"
        >

          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Truck size={20}/> Shipping Address
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <Input
              name="name"
              label="Full Name"
              value={address.name}
              onChange={handleChange}
              required
            />

            <Input
              name="email"
              label="Delivery Email"
              type="email"
              value={address.email}
              onChange={handleChange}
              required
            />

            <Input
              name="phone"
              label="Phone"
              value={address.phone}
              onChange={handleChange}
              required
            />

            <Input
              name="street"
              label="Street"
              value={address.street}
              onChange={handleChange}
              required
            />

            <Input
              name="postalCode"
              label="Postal Code"
              value={address.postalCode}
              onChange={handleChange}
              required
            />

            <Input
              name="city"
              label="City"
              value={address.city}
              onChange={handleChange}
              required
            />

            <Input
              name="state"
              label="State"
              value={address.state}
              onChange={handleChange}
              required
            />

          </div>

          {/* PAYMENT METHOD */}

          <div className="mt-8 space-y-3">

            <label className="flex items-center gap-3">

              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <IndianRupee size={18}/> Cash on Delivery

            </label>

            <label className="flex items-center gap-3">

              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <CreditCard size={18}/> Razorpay (UPI / Card)

            </label>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          >

            {loading
              ? "Processing..."
              : `Place Order ₹${subtotal.toFixed(2)}`}

          </button>

        </form>

        {/* ORDER SUMMARY */}

        <div className="bg-white p-8 rounded-xl shadow">

          <h3 className="text-xl font-semibold mb-6">
            Order Summary
          </h3>

          <div className="space-y-4 mb-6">

            {items.map((item) => (

              <div
                key={item._id}
                className="flex justify-between text-sm"
              >

                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{(item.finalPrice * item.quantity).toFixed(2)}
                </span>

              </div>

            ))}

          </div>

          <div className="border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default CheckoutPage;