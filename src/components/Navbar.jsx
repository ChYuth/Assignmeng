import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [admin, setAdmin] = useState(null);
  const { setShowSearch, getCartCount, user, logout } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    fetch("/api/admin/session")
      .then(async (response) => {
        if (response.status === 401) {
          if (active) setAdmin(null);
          return;
        }
        if (!response.ok) {
          throw new Error(`Unable to verify admin session (${response.status}).`);
        }

        const session = await response.json();
        if (active) setAdmin(session);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const logoutAdmin = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to log out of the admin account.");
      }

      setAdmin(null);
      setVisible(false);
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navStyle = ({ isActive }) =>
    `text-sm tracking-wide transition ${
      isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="flex items-center justify-between py-4">
        <Link to="/">
          <img src={assets.logo} className="w-32" alt="Logo" />
        </Link>

        <ul className="hidden sm:flex gap-8">
          <NavLink to="/" className={navStyle}>
            HOME
          </NavLink>
          <NavLink to="/collection" className={navStyle}>
            COLLECTION
          </NavLink>
          <NavLink to="/about" className={navStyle}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" className={navStyle}>
            CONTACT
          </NavLink>
          {admin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide ${
                  isActive ? "text-black" : "text-gray-600 hover:text-black"
                }`
              }
            >
              ADMIN PANEL
            </NavLink>
          )}
        </ul>

        <div className="flex items-center gap-5">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer hover:scale-110 transition"
            alt="Search"
          />

          <div className="group relative">
            <Link to={admin ? "/admin" : user ? "#" : "/login"}>
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer"
                alt="Profile"
              />
            </Link>

            <div className="hidden group-hover:block absolute right-0 pt-4">
              <div className="w-44 bg-white shadow-xl border rounded-xl p-4 text-sm">
                {admin ? (
                  <>
                    <p className="font-semibold text-black mb-1">ADMIN</p>
                    <p className="text-xs text-gray-500 mb-2">{admin.email}</p>
                    <Link
                      to="/admin"
                      className="block py-1 font-medium text-gray-700 hover:text-black"
                    >
                      Manage Products
                    </Link>
                    <button
                      type="button"
                      onClick={logoutAdmin}
                      className="py-1 text-gray-500 hover:text-black"
                    >
                      Logout
                    </button>
                  </>
                ) : user ? (
                  <>
                    <p className="font-semibold text-black mb-2">
                      {user.name}
                    </p>
                    <Link
                      to="/orders"
                      className="block py-1 hover:text-black text-gray-500"
                    >
                      My Orders
                    </Link>
                    <p
                      onClick={logout}
                      className="py-1 cursor-pointer hover:text-black text-gray-500"
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  <Link to="/login" className="hover:text-black text-gray-500">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart" />
            <p className="absolute -right-2 -bottom-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {getCartCount()}
            </p>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen bg-white z-50 transition-all ${
          visible ? "w-full" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col text-gray-700">
          <div
            onClick={() => setVisible(false)}
            className="p-4 border-b cursor-pointer"
          >
            BACK
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="p-4 border-b"
            to="/"
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="p-4 border-b"
            to="/collection"
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="p-4 border-b"
            to="/about"
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="p-4 border-b"
            to="/contact"
          >
            CONTACT
          </NavLink>

          {admin ? (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="p-4 border-b font-semibold"
                to="/admin"
              >
                ADMIN PANEL — MANAGE PRODUCTS
              </NavLink>
              <p
                onClick={logoutAdmin}
                className="p-4 border-b cursor-pointer"
              >
                ADMIN LOGOUT
              </p>
            </>
          ) : user ? (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="p-4 border-b"
                to="/orders"
              >
                ORDERS
              </NavLink>

              <p
                onClick={() => {
                  logout();
                  setVisible(false);
                }}
                className="p-4 border-b cursor-pointer"
              >
                LOGOUT
              </p>
            </>
          ) : (
            <NavLink
              onClick={() => setVisible(false)}
              className="p-4 border-b"
              to="/login"
            >
              LOGIN
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;