import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { placeOrder } from "../../features/order/orderApi";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";



export default function PlaceOrder({
  shippingAddress,
  paymentMethod,
  useProfileAddress,
  couponCode,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    let finalShippingAddress = shippingAddress;

    // If customer selected "Use My Default Address"
    if (useProfileAddress) {
      finalShippingAddress = {
        fullName: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || "",
      };
    }

    const {
      fullName,
      phone,
      email,
      address,
    } = finalShippingAddress;

    if (!fullName || !phone || !email || !address) {
      toast.error("Please fill all shipping details.");
      return;
    }

    try {
      setLoading(true);

      await placeOrder({
        shippingAddress: finalShippingAddress,
        paymentMethod,
        couponCode,
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