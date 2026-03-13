import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForgotPassword from "../features/auth/ForgetPassword";
import VerifyOTP from "../features/auth/VerifyOTP";
import ResetPassword from "../features/auth/ResetPassword";

import Dashboard from "../pages/Dashboard";
import AddEditProduct from "../features/products/AddEditProduct";
import CategoryAdmin from "../features/categories/AddEditCategory";
import ProductPage from "../pages/ProductPage";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartPage from "../pages/CartPage";

import ProtectedRoute from "./ProtectedRoute";

function Layout() {

  const location = useLocation();

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password"
  ];

  const hideNavbar = authPages.includes(location.pathname);
  const hideFooter = authPages.includes(location.pathname);

  return (

    <div className="min-h-screen flex flex-col">

      {!hideNavbar && <Navbar />}

      <main className="flex-1">

        <Routes>

          {/* PUBLIC ROUTES */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
           <Route path="/cart" element={<CartPage />} />

          <Route path="/product/:slug/:id" element={<ProductPage />} />


          {/* PROTECTED ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route path="/dashboard" element={<Dashboard />} />
           

          </Route>



          {/* ADMIN ROUTES */}

          <Route element={<ProtectedRoute adminOnly />}>

            <Route path="/add-product" element={<AddEditProduct />} />
            <Route path="/edit-product/:id" element={<AddEditProduct />} />
            <Route path="/admin/categories" element={<CategoryAdmin />} />

          </Route>

        </Routes>

      </main>

      {!hideFooter && <Footer />}

    </div>

  );

}

export default function AppRouter() {

  return (

    <BrowserRouter>
      <Layout />
    </BrowserRouter>

  );

}