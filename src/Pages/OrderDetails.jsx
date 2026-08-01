import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import {getOrderDetails,cancelOrder,} from "../features/order/orderApi";

import { toast } from "react-hot-toast";
import OrderTracking from "../Components/OrderTracking";


export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await getOrderDetails(orderId);
      setOrder(data.order);
    } catch (error) {
      toast.error("Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const { data } = await cancelOrder(orderId);

      toast.success(data.message);

      fetchOrder();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to cancel order."
      );
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="container py-5">
          Loading...
        </div>
        <Footer />
      </>
    );

  if (!order)
    return (
      <>
        <Navbar />
        <div className="container py-5">
          Order not found.
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />

      <section className="container py-5">

        <h2>Order Details</h2>

        <div className="checkout-card mt-4">

          <p>
            <strong>Order ID:</strong> {order._id}
          </p>

          <p>
            <strong>Status:</strong>{" "}

            <span
              className={`badge ${order.orderStatus === "Delivered"
                  ? "bg-success"
                  : order.orderStatus === "Cancelled"
                    ? "bg-danger"
                    : order.orderStatus === "Out for Delivery"
                      ? "bg-primary"
                      : "bg-warning text-dark"
                }`}
            >
              {order.orderStatus}
            </span>
          </p>

          <p>
            <strong>Payment:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}

            <span
              className={`badge ${order.paymentStatus === "Paid"
                  ? "bg-success"
                  : order.paymentStatus === "Failed"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
            >
              {order.paymentStatus}
            </span>
          </p>

          <p>
            <strong>Subtotal:</strong> ₹{order.totalAmount}
          </p>

          {order.discountAmount > 0 && (
            <>
              <p>
                <strong>Coupon:</strong> {order.couponCode}
              </p>

              <p className="text-success">
                <strong>Discount:</strong> -₹{order.discountAmount}
              </p>
            </>
          )}

          <p>
            <strong>Final Amount:</strong> ₹{order.finalAmount}
          </p>

        </div>

        <div className="mt-4">
          <OrderTracking order={order} />
        </div>

        <div className="checkout-card mt-4">

          <h4>Shipping Address</h4>

          <p>{order.shippingAddress.fullName}</p>

          <p>{order.shippingAddress.phone}</p>

          <p>{order.shippingAddress.email}</p>

          <p>{order.shippingAddress.address}</p>

          <p>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}
          </p>

          <p>{order.shippingAddress.pincode}</p>

        </div>

        <div className="checkout-card mt-4">

          <h4>Products</h4>

          {order.items.map((item) => (
            <div
              key={item.product._id}
              className="d-flex justify-content-between py-2 border-bottom"
            >
              <div>
                <strong>{item.product.name}</strong>

                <p>
                  Qty: {item.quantity}
                </p>

                <p>
                  Size: {item.size}
                </p>

                <p>
                  Color: {item.color}
                </p>
              </div>

              <strong>
                ₹{item.price}
              </strong>
            </div>
          ))}

        </div>

        {["Pending", "Confirmed"].includes(order.orderStatus) && (
          <button
            className="btn btn-danger mt-4"
            onClick={handleCancel}
          >
            Cancel Order
          </button>
        )}

      </section>

      <Footer />
    </>
  );
}