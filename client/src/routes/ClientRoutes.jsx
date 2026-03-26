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
import CategoryPage from "../client/pages/CategoryPage";
import SearchPage from "../client/pages/SearchPage";



export default function ClientRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />

      {/* ✅ PRODUCT */}
      <Route path="/product/:slug/:id" element={<ProductPage />} />

      {/* ✅ CATEGORY (FIXED) */}
      <Route path="/category/:categoryId" element={<CategoryPage />} />

      {/* (Optional fallback) */}
      <Route path="/category" element={<CategoryPage />} />

      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* USER */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />


    </Routes>
  );
}