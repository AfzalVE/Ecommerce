import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { apiSlice } from "../../../app/api/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../../../modules/auth/authApi";
import { useGetCartCountQuery } from "../../../modules/cart/cartApi";

import logo from "../../../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutUserMutation();

  const isAdmin = user?.role === "admin";

  const { data } = useGetCartCountQuery();
  const cartItemsCount = data?.count || 0;

  // =============================
  // 🔄 SYNC SEARCH WITH URL
  // =============================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearch(q);
  }, [location.search]);

  // =============================
  // 🔍 SEARCH
  // =============================
  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/category?search=${search}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // =============================
  // ❌ CLEAR SEARCH
  // =============================
  const clearSearch = () => {
    setSearch("");

    // ✅ Remove search param → reset page
    navigate("/category");
  };

  // =============================
  // 🔐 LOGOUT
  // =============================
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(apiSlice.util.resetApiState());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 🔷 LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-32 w-auto object-contain"
            />

            {isAdmin && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-semibold">
                Admin
              </span>
            )}
          </Link>

          {/* 🔍 SEARCH */}
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3 relative">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* ❌ CLEAR BUTTON */}
            {search && (
              <button onClick={clearSearch}>
                <X size={18} className="text-gray-500 hover:text-black" />
              </button>
            )}
          </div>

          {/* 🖥 MENU */}
          <div className="hidden md:flex items-center gap-6">

            {isAuthenticated && (
              <span className="text-sm font-medium text-gray-700">
                Hi, {user?.name || "User"}
              </span>
            )}

            {!isAdmin && (
              <>
                <Link to="/category">Categories</Link>
                {isAuthenticated && <Link to="/orders">My Orders</Link>}
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/orders">Orders</Link>
              </>
            )}

            {!isAdmin && isAuthenticated && (
              <div className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5 h-5 flex items-center justify-center min-w-[20px]">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <User />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* 📱 MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-3">

          {/* 🔍 MOBILE SEARCH */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none px-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown} // ✅ FIXED
            />

            {search && (
              <button onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          {isAuthenticated && <p>Hi, {user?.name}</p>}

          {!isAdmin && (
            <>
              <Link to="/category" onClick={closeMenu}>Categories</Link>
              {isAuthenticated && <Link to="/orders" onClick={closeMenu}>My Orders</Link>}
              {isAuthenticated && (
                <Link to="/cart" onClick={closeMenu}>
                  Cart ({cartItemsCount})
                </Link>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link to="/admin/orders" onClick={closeMenu}>Orders</Link>
            </>
          )}

          {!isAuthenticated ? (
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}