import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { getMyOrders } from "../features/order/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          Loading orders...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="container py-5">
        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="checkout-card mb-4"
            >
              <h5>Order #{order._id.slice(-6)}</h5>

              <p>Status: {order.orderStatus}</p>

              <p>Payment: {order.paymentMethod}</p>

              <p>Total: ₹{order.totalAmount}</p>

              <Link
                to={`/orders/${order._id}`}
                className="btn btn-dark"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </section>

      <Footer />
    </>
  );
}