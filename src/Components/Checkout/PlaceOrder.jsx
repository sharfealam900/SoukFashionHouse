import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { placeOrder } from "../../features/order/orderApi";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";



export default function PlaceOrder({
  shippingAddress,
  paymentMethod,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    const {
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    } = shippingAddress;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      toast.error("Please fill all shipping details.");
      return;
    }

    try {
      setLoading(true);

      await placeOrder({
        shippingAddress,
        paymentMethod,
      });

      dispatch(clearCart());
      
      toast.success("Order placed successfully!");

      navigate("/order-success");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to place order."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="place-order-btn"
      onClick={handlePlaceOrder}
      disabled={loading}
    >
      {loading ? "Placing Order..." : "Place Order"}
    </button>
  );
}