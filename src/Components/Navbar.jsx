import React, { useEffect, useState, useRef } from "react";
import { Search, Heart, ShoppingBag, X, ChevronDown, User, Menu } from "lucide-react";
import api from "../api/axios";

import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";




export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryRef = useRef(null);

  const { user } = useSelector((state) => state.auth || {});

  const cartCount = useSelector(
    (state) => state.cart.totalItems
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist.wishlist.length
  );


  const [mobileMenu, setMobileMenu] = useState(false);

  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);

  const [dropdown, setDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {
    getCategories();
  }, []);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);



  useEffect(() => {
    const closeMenu = () => {
      setProfileDropdown(false);
    };
    window.addEventListener("click", closeMenu);
    return () =>
      window.removeEventListener("click", closeMenu);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const getCategories = async () => {
    try {
      const { data } = await api.get("/categories");



      setCategories(data.categories || []);
    } catch (err) {
      console.log(err);
    }
  };

  const searchProduct = (e) => {
    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) return;


    navigate(`/shop?search=${encodeURIComponent(keyword)}`);

    setSearch("");
    setMobileMenu(false);
  };


  const logoutHandler = async () => {
    try {
      await api.get("/user/logout");

      dispatch(logout());

      navigate("/login");

      setProfileDropdown(false);

      setMobileMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <header className={scrolled ? "navbar active" : "navbar"}>
      <div className="navbar-container">
        {/* Logo */}

        <Link to="/" className="logo">
          SOUK
        </Link>

        {/* Desktop Menu */}

        <nav className="desktop-menu">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/shop">Shop</NavLink>

          <div
            className="category-dropdown"
            ref={categoryRef}
          >
            <button
              className="filter-category-btn"
              onClick={() => setDropdown((prev) => !prev)}
            >
              Categories
              <ChevronDown
  size={16}
  className={dropdown ? "chevron rotate" : "chevron"}
/>
            </button>

            {dropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "220px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  boxShadow: "0 15px 40px rgba(0,0,0,.15)",
                  zIndex: 999999,
                  padding: "10px 0",
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/shop?category=${cat.slug}`}
                    style={{
                      display: "block",
                      padding: "12px 20px",
                      color: "#222",
                      textDecoration: "none",
                    }}
                  >
                    {cat.name}
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

        {/* Search */}

        <form
          className="navbar-search"
          onSubmit={searchProduct}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </form>

        {/* Right Icons */}

        <div className="navbar-icons">
          <Link to="/wishlist" className="icon-box">
            <Heart size={22} />

            {wishlistCount > 0 && (
              <span>{wishlistCount}</span>
            )}
          </Link>

          <Link to="/cart" className="icon-box">
            <ShoppingBag size={22} />

            {cartCount > 0 && (
              <span>{cartCount}</span>
            )}
          </Link>

          <div className="profile-dropdown">

            <button
              className="profile-btn"
              onClick={(e) => {

                e.stopPropagation();

                setProfileDropdown(!profileDropdown);

              }}
            >
              <User size={22} />
            </button>

            {profileDropdown && (

              <div
                className="profile-menu"
                onClick={(e) => e.stopPropagation()}
              >

                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setProfileDropdown(false)
                      }
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setProfileDropdown(false)
                      }
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() =>
                        setProfileDropdown(false)
                      }
                    >
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() =>
                        setProfileDropdown(false)
                      }
                    >
                      Orders
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() =>
                          setProfileDropdown(false)
                        }
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                    >
                      Logout
                    </button>

                  </>
                )}

              </div>

            )}

          </div>

          <button
            className="mobile-btn"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>
        {/* Mobile Menu */}

        {mobileMenu && (
          <div className="mobile-menu">

            <NavLink
              to="/"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={() => setMobileMenu(false)}
            >
              Shop
            </NavLink>

            <div className="mobile-category">

              <h4>Categories</h4>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileMenu(false)}
                >
                  {cat.name}
                </Link>
              ))}

            </div>

            <NavLink
              to="/about"
              onClick={() => setMobileMenu(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenu(false)}
            >
              Contact
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() => setMobileMenu(false)}
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setMobileMenu(false)}
            >
              Cart
            </NavLink>

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenu(false)}
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenu(false)}
                >
                  Orders
                </NavLink>

                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenu(false)}
                  >
                    Dashboard
                  </NavLink>
                )}

                <button
                  className="logout-btn"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </>
            )}

          </div>
        )}

      </div>
    </header>
  );
}