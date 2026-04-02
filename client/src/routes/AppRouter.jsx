import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../shared/components/layout/Navbar";
import Footer from "../shared/components/layout/Footer";
import ChatInterface from "../shared/components/chat/ChatInterface";
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

  const hideNavbar = authPages.includes(location.pathname); // only hide on auth pages
  const hideFooter = authPages.includes(location.pathname); // only hide on auth pages

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
      <ChatInterface />
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