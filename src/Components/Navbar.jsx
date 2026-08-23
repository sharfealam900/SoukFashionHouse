import React, { useEffect, useState, useRef } from "react";

import {
  Search,
  Heart,
  ShoppingBag,
  X,
  ChevronDown,
  User,
  Menu,
  Home,
  Store,
  Info,
  Phone,
  UserRound,
  Package,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
} from "lucide-react";

import api from "../api/axios";

import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";
import { clearWishlist } from "../features/wishlist/wishlistSlice";
import { clearCart } from "../features/cart/cartSlice";

import logo from "../assets/logo.jpg";



export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const cartCount = useSelector(
    (state) => state.cart?.totalItems || 0
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist?.wishlist?.length || 0
  );

  /* =========================
     STATES
  ========================= */

  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const [dropdown, setDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  /* =========================
     GET CATEGORIES
  ========================= */

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const { data } = await api.get("/categories");

      setCategories(data?.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  /* =========================
     NAVBAR SCROLL
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================
     LOCK BODY WHEN MOBILE DRAWER OPEN
  ========================= */

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenu]);

  /* =========================
     CLOSE DESKTOP PROFILE DROPDOWN
  ========================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================
     CLOSE CATEGORY DROPDOWN
  ========================= */

  useEffect(() => {
    const handleOutsideCategory = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideCategory
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideCategory
      );
    };
  }, []);

  /* =========================
     SEARCH
  ========================= */

  const searchProduct = (e) => {
    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) return;

    navigate(
      `/shop?search=${encodeURIComponent(keyword)}`
    );

    setSearch("");
    setMobileMenu(false);
  };

  /* =========================
     CLOSE MOBILE MENU
  ========================= */

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  /* =========================
     PROFILE BUTTON
     
     DESKTOP:
     small futuristic dropdown

     MOBILE:
     full navigation drawer
  ========================= */

  const handleProfileClick = (e) => {
    e.stopPropagation();

    /*
      On mobile the profile icon IS the menu button.
      CSS handles which interface is visible.
    */

    setMobileMenu((prev) => !prev);

    setProfileDropdown(false);
  };

  /* =========================
     DESKTOP PROFILE
  ========================= */

  const handleDesktopProfileClick = (e) => {
    e.stopPropagation();

    setProfileDropdown((prev) => !prev);
  };

  /* =========================
     LOGOUT
  ========================= */

  const logoutHandler = async () => {
    try {
      /*
        Call backend first.
        This keeps the existing logout functionality.
      */
      await api.post("/users/logout");
    } catch (error) {
      /*
        Even if the server returns 401 because
        the session is already expired, we still
        clear the frontend state.
      */
      console.error(
        "Logout request:",
        error?.response?.status || error
      );
    } finally {
      /*
        Always clear local authentication state.
      */
      dispatch(logout());
      dispatch(clearWishlist());
      dispatch(clearCart());

      setProfileDropdown(false);
      setMobileMenu(false);
      setDropdown(false);

      navigate("/", { replace: true });
    }
  };

  /* =========================
     NAVIGATION HELPER
  ========================= */

  const closeAllMenus = () => {
    setMobileMenu(false);
    setProfileDropdown(false);
    setDropdown(false);
  };

  return (
    <>
      <header
        className={`navbar ${
          scrolled ? "active" : ""
        }`}
      >
        <div className="navbar-container">

          {/* =================================
              LOGO
          ================================= */}

          <Link
            to="/"
            className="logo"
            onClick={closeAllMenus}
          >
            <img
              src={logo}
              alt="SOUK Fashion House"
            />
          </Link>

          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}

          <nav className="desktop-menu">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Shop
            </NavLink>

            {/* =========================
                CATEGORIES
            ========================= */}

            <div
              className="category-dropdown"
              ref={categoryRef}
            >
              <button
                type="button"
                className="filter-category-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  setDropdown((prev) => !prev);
                  setProfileDropdown(false);
                }}
              >
                Categories

                <ChevronDown
                  size={16}
                  className={
                    dropdown
                      ? "chevron rotate"
                      : "chevron"
                  }
                />
              </button>

              {dropdown && (
                <div className="desktop-category-menu">

                  <div className="desktop-category-header">
                    <span>SHOP BY CATEGORY</span>
                  </div>

                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/shop?category=${cat.slug}`}
                      onClick={() =>
                        setDropdown(false)
                      }
                    >
                      <span>{cat.name}</span>

                      <span className="category-arrow">
                        →
                      </span>
                    </Link>
                  ))}

                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Contact
            </NavLink>

          </nav>

          {/* =================================
              SEARCH
          ================================= */}

          <form
            className="navbar-search"
            onSubmit={searchProduct}
          >
            <Search size={19} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </form>

          {/* =================================
              RIGHT SIDE ICONS
          ================================= */}

          <div className="navbar-icons">

            {/* =========================
                WISHLIST
            ========================= */}

            <Link
              to="/wishlist"
              className="icon-box"
              onClick={closeAllMenus}
              aria-label="Wishlist"
            >
              <Heart size={22} />

              {wishlistCount > 0 && (
                <span className="icon-count">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* =========================
                CART
            ========================= */}

            <Link
              to="/cart"
              className="icon-box"
              onClick={closeAllMenus}
              aria-label="Cart"
            >
              <ShoppingBag size={22} />

              {cartCount > 0 && (
                <span className="icon-count">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =================================
                PROFILE
                ONLY MENU BUTTON ON MOBILE
            ================================= */}

            <div
              className="profile-dropdown"
              ref={profileRef}
            >

              <button
                type="button"
                className={`profile-btn ${
                  profileDropdown
                    ? "profile-open"
                    : ""
                }`}
                onClick={handleProfileClick}
                aria-label="Account menu"
              >
                <User size={22} />

                <span className="profile-dot" />
              </button>

              {/* =================================
                  DESKTOP PROFILE DROPDOWN
              ================================= */}

              <div
                className={`profile-menu ${
                  profileDropdown
                    ? "profile-menu-open"
                    : ""
                }`}
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {/* Account Header */}

                <div className="profile-menu-header">

                  <div className="profile-menu-avatar">
                    <User size={25} />
                  </div>

                  <div>
                    <span>
                      {user
                        ? "WELCOME BACK"
                        : "WELCOME TO SOUK"}
                    </span>

                    <strong>
                      {user
                        ? "My Account"
                        : "Your Account"}
                    </strong>
                  </div>

                </div>

                <div className="profile-menu-divider" />

                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={closeAllMenus}
                      className="profile-menu-item"
                    >
                      <span className="profile-item-icon">
                        <LogIn size={19} />
                      </span>

                      <span className="profile-item-content">
                        <strong>Login</strong>
                        <small>
                          Sign in to your account
                        </small>
                      </span>

                      <span className="profile-item-arrow">
                        →
                      </span>
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeAllMenus}
                      className="profile-menu-item"
                    >
                      <span className="profile-item-icon">
                        <UserPlus size={19} />
                      </span>

                      <span className="profile-item-content">
                        <strong>Register</strong>
                        <small>
                          Create a new account
                        </small>
                      </span>

                      <span className="profile-item-arrow">
                        →
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="profile-menu-item"
                    >
                      <span className="profile-item-icon">
                        <UserRound size={19} />
                      </span>

                      <span className="profile-item-content">
                        <strong>Profile</strong>
                        <small>
                          Manage your account
                        </small>
                      </span>

                      <span className="profile-item-arrow">
                        →
                      </span>
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={closeAllMenus}
                      className="profile-menu-item"
                    >
                      <span className="profile-item-icon">
                        <Package size={19} />
                      </span>

                      <span className="profile-item-content">
                        <strong>Orders</strong>
                        <small>
                          View your orders
                        </small>
                      </span>

                      <span className="profile-item-arrow">
                        →
                      </span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={closeAllMenus}
                        className="profile-menu-item"
                      >
                        <span className="profile-item-icon">
                          <LayoutDashboard size={19} />
                        </span>

                        <span className="profile-item-content">
                          <strong>Dashboard</strong>
                          <small>
                            Manage your store
                          </small>
                        </span>

                        <span className="profile-item-arrow">
                          →
                        </span>
                      </Link>
                    )}

                    <div className="profile-menu-divider" />

                    <button
                      type="button"
                      className="profile-logout"
                      onClick={logoutHandler}
                    >
                      <span>
                        <LogOut size={19} />
                      </span>

                      Logout
                    </button>
                  </>
                )}

              </div>

            </div>

            {/* =================================
                IMPORTANT:
                NO MOBILE MENU ICON HERE
            ================================= */}

          </div>

        </div>
      </header>

      {/* =========================================
          MOBILE DRAWER
          Profile icon opens this drawer
      ========================================= */}

      <div
        className={`mobile-menu-overlay ${
          mobileMenu
            ? "mobile-overlay-open"
            : ""
        }`}
        onClick={closeMobileMenu}
      />

      <aside
        className={`mobile-menu ${
          mobileMenu
            ? "mobile-menu-open"
            : ""
        }`}
      >

        {/* =========================
            DRAWER HEADER
        ========================= */}

        <div className="mobile-menu-header">

          <div className="mobile-menu-brand">

            <img
              src={logo}
              alt="SOUK Fashion House"
            />

            <div>
              <strong>SOUK</strong>
              <small>FASHION HOUSE</small>
            </div>

          </div>

          <button
            type="button"
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* Decorative line */}

        <div className="mobile-menu-line">
          <span />
          <Sparkles size={13} />
          <span />
        </div>

        {/* =========================
            DRAWER CONTENT
        ========================= */}

        <div className="mobile-menu-content">

          {/* HOME */}

          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <Home size={19} />
            </span>

            <span>Home</span>

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* SHOP */}

          <NavLink
            to="/shop"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <Store size={19} />
            </span>

            <span>Shop</span>

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* =========================
              CATEGORIES
          ========================= */}

          <div className="mobile-category">

            <div className="mobile-section-title">
              CATEGORIES
            </div>

            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                onClick={closeMobileMenu}
                className="mobile-category-item"
              >
                <span>{cat.name}</span>

                <span>→</span>
              </Link>
            ))}

          </div>

          {/* ABOUT */}

          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <Info size={19} />
            </span>

            <span>About</span>

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* CONTACT */}

          <NavLink
            to="/contact"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <Phone size={19} />
            </span>

            <span>Contact</span>

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* WISHLIST */}

          <NavLink
            to="/wishlist"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <Heart size={19} />
            </span>

            <span>Wishlist</span>

            {wishlistCount > 0 && (
              <span className="mobile-count">
                {wishlistCount}
              </span>
            )}

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* CART */}

          <NavLink
            to="/cart"
            onClick={closeMobileMenu}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">
              <ShoppingBag size={19} />
            </span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span className="mobile-count">
                {cartCount}
              </span>
            )}

            <span className="mobile-nav-arrow">
              →
            </span>
          </NavLink>

          {/* =========================
              ACCOUNT
          ========================= */}

          <div className="mobile-account-title">
            ACCOUNT
          </div>

          {!user ? (
            <>
              {/* LOGIN */}

              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                <span className="mobile-nav-icon">
                  <LogIn size={19} />
                </span>

                <span>Login</span>

                <span className="mobile-nav-arrow">
                  →
                </span>
              </NavLink>

              {/* REGISTER */}

              <NavLink
                to="/register"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                <span className="mobile-nav-icon">
                  <UserPlus size={19} />
                </span>

                <span>Register</span>

                <span className="mobile-nav-arrow">
                  →
                </span>
              </NavLink>
            </>
          ) : (
            <>
              {/* PROFILE */}

              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                <span className="mobile-nav-icon">
                  <UserRound size={19} />
                </span>

                <span>Profile</span>

                <span className="mobile-nav-arrow">
                  →
                </span>
              </NavLink>

              {/* ORDERS */}

              <NavLink
                to="/my-orders"
                onClick={closeMobileMenu}
                className="mobile-nav-item"
              >
                <span className="mobile-nav-icon">
                  <Package size={19} />
                </span>

                <span>Orders</span>

                <span className="mobile-nav-arrow">
                  →
                </span>
              </NavLink>

              {/* ADMIN */}

              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="mobile-nav-item"
                >
                  <span className="mobile-nav-icon">
                    <LayoutDashboard size={19} />
                  </span>

                  <span>Dashboard</span>

                  <span className="mobile-nav-arrow">
                    →
                  </span>
                </NavLink>
              )}
            </>
          )}

        </div>

        {/* =========================
            MOBILE FOOTER
        ========================= */}

        <div className="mobile-menu-footer">

          {!user ? (
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="mobile-footer-register"
            >
              Create your SOUK account
              <span>→</span>
            </Link>
          ) : (
            <button
              type="button"
              className="mobile-footer-logout"
              onClick={logoutHandler}
            >
              <LogOut size={18} />
              Logout
            </button>
          )}

          <div className="mobile-footer-brand">
            <strong>SOUK FASHION HOUSE</strong>

            <small>
              Timeless fashion, thoughtfully crafted.
            </small>
          </div>

        </div>

      </aside>
    </>
  );
}