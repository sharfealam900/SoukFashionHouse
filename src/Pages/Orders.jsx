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
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "order-status delivered";

      case "cancelled":
      case "canceled":
        return "order-status cancelled";

      case "shipped":
        return "order-status shipped";

      case "processing":
        return "order-status processing";

      case "confirmed":
        return "order-status confirmed";

      default:
        return "order-status";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-container">
            <div className="orders-loading">
              <div className="orders-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-container">

          {/* PAGE HEADER */}
          <div className="orders-header">
            <div>
              <h1>My Orders</h1>
              <p>
                Track and manage your recent purchases
              </p>
            </div>

            {orders.length > 0 && (
              <div className="orders-count">
                {orders.length}{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </div>
            )}
          </div>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-icon">
                🛍️
              </div>

              <h2>No orders yet</h2>

              <p>
                You haven't placed any orders yet.
                Start shopping and your orders will appear here.
              </p>

              <Link
                to="/shop"
                className="shop-now-btn"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="orders-list">

              {orders.map((order) => (
                <article
                  key={order._id}
                  className="order-card"
                >

                  {/* TOP SECTION */}
                  <div className="order-card-top">

                    <div className="order-main-info">
                      <span className="order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order._id.slice(-6).toUpperCase()}
                      </h2>

                      {order.createdAt && (
                        <span className="order-date">
                          Placed on {formatDate(order.createdAt)}
                        </span>
                      )}
                    </div>

                    <span
                      className={getStatusClass(
                        order.orderStatus
                      )}
                    >
                      <span className="status-dot"></span>
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>

                  {/* DIVIDER */}
                  <div className="order-divider"></div>

                  {/* ORDER INFORMATION */}
                  <div className="order-info-grid">

                    <div className="order-info-item">
                      <span className="order-info-label">
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod === "RAZORPAY"
                          ? "Razorpay"
                          : order.paymentMethod || "COD"}
                      </strong>
                    </div>

                    <div className="order-info-item">
                      <span className="order-info-label">
                        Total Amount
                      </span>

                      <strong className="order-total">
                        ₹{Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    {order.items && (
                      <div className="order-info-item">
                        <span className="order-info-label">
                          Items
                        </span>

                        <strong>
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "Item"
                            : "Items"}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="order-card-bottom">

                    <div className="order-payment">
                      {order.paymentMethod === "RAZORPAY" ? (
                        <>
                          <span className="payment-check">
                            ✓
                          </span>

                          <span>
                            Payment completed
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="payment-cod">
                            ₹
                          </span>

                          <span>
                            Cash on Delivery
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="view-order-btn"
                    >
                      View Details
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}