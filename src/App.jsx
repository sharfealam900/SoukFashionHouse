import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import AuthLoader from "./Components/AuthLoader";
import CartLoader from "./Components/CartLoader";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import WishlistLoader from "./Components/WishlistLoader";
import Wishlist from "./Pages/Wishlist";
import ProductDetails from "./Pages/ProductDetails";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";

import Categories from "./admin/pages/Categories";
import Users from "./admin/pages/Users";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import AddProduct from "./admin/pages/AddProduct";



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
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<Orders />} />


        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />

          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;