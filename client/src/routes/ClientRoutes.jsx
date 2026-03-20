import { Routes, Route } from "react-router-dom";

import Home from "../client/pages/Home";
import ProductPage from "../client/pages/ProductPage";
import CartPage from "../client/pages/CartPage";
import CheckoutPage from "../client/pages/CheckoutPage";
import OrdersPage from "../client/pages/OrdersPage";

import LoginPage from "../modules/auth/LoginPage";
import RegisterPage from "../modules/auth/RegisterPage";
import ForgotPassword from "../modules/auth/ForgetPassword";
import VerifyOTP from "../modules/auth/VerifyOTP";
import ResetPassword from "../modules/auth/ResetPassword";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug/:id" element={<ProductPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
}