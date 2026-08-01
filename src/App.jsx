import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import OrderSuccess from "./Pages/OrderSuccess";
import Wishlist from "./Pages/Wishlist";
import ProductDetails from "./Pages/ProductDetails";

import AuthLoader from "./Components/AuthLoader";
import CartLoader from "./Components/CartLoader";
import WishlistLoader from "./Components/WishlistLoader";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";

import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AddProduct from "./admin/pages/AddProduct";
import Categories from "./admin/pages/Categories";
import AdminOrders from "./admin/pages/AdminOrders";
import Users from "./admin/pages/Users";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";

import Coupons from "./admin/pages/Coupons";
import AddCoupon from "./admin/pages/AddCoupon";
import Subscribers from "./admin/pages/Subscribers";

import Banners from "./admin/pages/Banners";
import AddBanner from "./admin/pages/AddBanner";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyResetOtp from "./Pages/VerifyResetOtp";
import ResetPassword from "./Pages/ResetPassword";
import ContactManagement from "./admin/pages/ContactManagement";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Blog from "./Pages/Blog";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthLoader />
      <CartLoader />
      <WishlistLoader />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/privacy-policy"element={<PrivacyPolicy />}/>
        <Route path="/blog"element={<Blog />}/>



        {/* ================= CUSTOMER ROUTES ================= */}

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/change-password" element={<ChangePassword />} /> </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* ================= ADMIN ROUTES ================= */}

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<AddProduct />} />


            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />

            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/new" element={<AddCoupon />} />
            <Route path="coupons/edit/:id" element={<AddCoupon />} />

            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/new" element={<AddCoupon />} />
            <Route path="coupons/edit/:id" element={<AddCoupon />} />

            <Route path="subscribers" element={<Subscribers />} />

            <Route path="/admin/banners" element={<Banners />} />
            <Route path="/admin/banners/new" element={<AddBanner />} />
            <Route path="/admin/banners/edit/:id" element={<AddBanner />} />

            <Route path="/admin/contact"element={<ContactManagement />}/>



          </Route>
        </Route>

        {/* ================= 404 PAGE ================= */}

        <Route path="*" element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;