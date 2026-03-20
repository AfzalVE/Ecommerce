import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../shared/components/layout/Navbar";
import Footer from "../shared/components/layout/Footer";

import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";

function Layout() {
  const location = useLocation();

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password"
  ];

  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideNavbar = authPages.includes(location.pathname) || isAdminRoute;
  const hideFooter = authPages.includes(location.pathname) || isAdminRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* CLIENT ROUTES */}
          <Route path="/*" element={<ClientRoutes />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/*" element={<AdminRoutes />} />
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