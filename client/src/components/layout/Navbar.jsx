import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../../features/auth/authApi";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [logoutUser] = useLogoutUserMutation();

  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {

    try {

      await logoutUser().unwrap();

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

          {/* LOGO */}

          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600"
          >
            {isAdmin ? "ShopSphere Admin" : "ShopSphere"}
          </Link>

          {/* SEARCH */}

          {!isAdmin && (
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none px-2 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>
          )}

          {/* DESKTOP MENU */}

          <div className="hidden md:flex items-center gap-6">

            {/* USER NAV */}

            {!isAdmin && (
              <>
                <Link to="/products">Products</Link>
                <Link to="/categories">Categories</Link>

                {isAuthenticated && (
                  <Link to="/orders">My Orders</Link>
                )}
              </>
            )}

            {/* ADMIN NAV */}

            {isAdmin && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/add-product">Add Product</Link>
                <Link to="/orders">Orders</Link>
              </>
            )}

            {/* CART */}

            {!isAdmin && isAuthenticated && (
              <div className="relative">
                <Link to="/cart" className="flex items-center gap-1">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
            )}


            {/* LOGIN / LOGOUT */}

            {!isAuthenticated ? (

              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>

            ) : (

              <div className="flex items-center gap-4">

                <User className="cursor-pointer" />

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

          {/* MOBILE MENU BUTTON */}

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="md:hidden border-t px-4 py-3 space-y-3">

          {!isAdmin && (
            <>
              <Link to="/products" onClick={closeMenu} className="block">
                Products
              </Link>

              <Link to="/categories" onClick={closeMenu} className="block">
                Categories
              </Link>

              {isAuthenticated && (
                <Link to="/orders" onClick={closeMenu} className="block">
                  My Orders
                </Link>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="block">
                Dashboard
              </Link>

              <Link to="/add-product" onClick={closeMenu} className="block">
                Add Product
              </Link>

              <Link to="/orders" onClick={closeMenu} className="block">
                Orders
              </Link>
            </>
          )}

          {!isAuthenticated ? (

            <Link
              to="/login"
              onClick={closeMenu}
              className="block bg-indigo-600 text-white text-center py-2 rounded-lg"
            >
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