import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import AuthLoader from "./Components/AuthLoader";
import CartLoader from "./Components/CartLoader";
import WishlistLoader from "./Components/WishlistLoader";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";

const Home = lazy(() => import("./Pages/Home"));
const Shop = lazy(() => import("./Pages/Shop"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Cart = lazy(() => import("./Pages/Cart"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const Orders = lazy(() => import("./Pages/Orders"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const OrderSuccess = lazy(() => import("./Pages/OrderSuccess"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const Profile = lazy(() => import("./Pages/Profile"));
const ChangePassword = lazy(() => import("./Pages/ChangePassword"));
const VerifyOtp = lazy(() => import("./Pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const VerifyResetOtp = lazy(() => import("./Pages/VerifyResetOtp"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const Blog = lazy(() => import("./Pages/Blog"));
const Story = lazy(() => import("./Pages/Story"));

const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("./admin/pages/AdminProducts"));
const AddProduct = lazy(() => import("./admin/pages/AddProduct"));
const Categories = lazy(() => import("./admin/pages/Categories"));
const AdminOrders = lazy(() => import("./admin/pages/AdminOrders"));
const Users = lazy(() => import("./admin/pages/Users"));
const Coupons = lazy(() => import("./admin/pages/Coupons"));
const AddCoupon = lazy(() => import("./admin/pages/AddCoupon"));
const Subscribers = lazy(() => import("./admin/pages/Subscribers"));
const Banners = lazy(() => import("./admin/pages/Banners"));
const AddBanner = lazy(() => import("./admin/pages/AddBanner"));
const ContactManagement = lazy(() => import("./admin/pages/ContactManagement"));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-spinner"></div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          margin: 0,
        }}
      >
        Page Not Found
      </p>
    </div>
  );
}

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

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/story" element={<Story />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

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
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="banners" element={<Banners />} />
              <Route path="banners/new" element={<AddBanner />} />
              <Route path="banners/edit/:id" element={<AddBanner />} />
              <Route path="contact" element={<ContactManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;