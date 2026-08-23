import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  placeOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../features/order/orderApi";

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

  // =====================================================
  // LOAD RAZORPAY CHECKOUT SCRIPT
  // =====================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Already loaded
      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // GET FINAL SHIPPING ADDRESS
  // =====================================================

  const getFinalShippingAddress = () => {
    if (useProfileAddress) {
      return {
        fullName: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || "",
      };
    }

    return shippingAddress;
  };

  // =====================================================
  // VALIDATE SHIPPING ADDRESS
  // =====================================================

  const validateShippingAddress = (
    finalShippingAddress
  ) => {
    if (!finalShippingAddress) {
      toast.error(
        "Please fill all shipping details."
      );

      return false;
    }

    const {
      fullName,
      phone,
      email,
      address,
    } = finalShippingAddress;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address
    ) {
      toast.error(
        "Please fill all shipping details."
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // COD ORDER
  // =====================================================

  const handleCODOrder = async (
    finalShippingAddress
  ) => {
    try {
      await placeOrder({
        shippingAddress: finalShippingAddress,
        paymentMethod: "COD",
        couponCode,
      });

      dispatch(clearCart());

      toast.success(
        "Order placed successfully!"
      );

      navigate("/order-success");
    } catch (error) {
      throw error;
    }
  };

  // =====================================================
  // RAZORPAY ORDER
  // =====================================================

  const handleRazorpayOrder = async (
    finalShippingAddress
  ) => {
    // ---------------------------------------------------
    // Check frontend Razorpay key
    // ---------------------------------------------------

    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID;



    if (!razorpayKey) {
      throw new Error(
        "Razorpay frontend key is missing."
      );
    }

    // ---------------------------------------------------
    // Load Razorpay Checkout
    // ---------------------------------------------------

    const scriptLoaded =
      await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error(
        "Unable to load Razorpay. Please check your internet connection."
      );

      return;
    }

    // ---------------------------------------------------
    // Make sure Razorpay is available
    // ---------------------------------------------------

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout failed to load."
      );
    }

    // ---------------------------------------------------
    // Create Razorpay order on backend
    // ---------------------------------------------------

    const razorpayData =
      await createRazorpayOrder({
        shippingAddress:
          finalShippingAddress,
        couponCode,
      });



    // ---------------------------------------------------
    // Validate backend response
    // ---------------------------------------------------

    if (
      !razorpayData ||
      !razorpayData.razorpayOrderId
    ) {
      throw new Error(
        "Unable to create Razorpay order."
      );
    }

    // ---------------------------------------------------
    // Razorpay Checkout options
    // ---------------------------------------------------

    const options = {
      // IMPORTANT:
      // Use Vite frontend environment variable.
      key: razorpayKey,

      amount: razorpayData.amount,

      currency:
        razorpayData.currency || "INR",

      name: "Souk Fashion House",

      description: "Order Payment",

      order_id:
        razorpayData.razorpayOrderId,

      // -------------------------------------------------
      // Customer information
      // -------------------------------------------------

      prefill: {
        name:
          finalShippingAddress.fullName,

        email:
          finalShippingAddress.email,

        contact:
          finalShippingAddress.phone,
      },

      // -------------------------------------------------
      // Notes
      // -------------------------------------------------

      notes: {
        address:
          finalShippingAddress.address,
      },

      // -------------------------------------------------
      // Theme
      // -------------------------------------------------

      theme: {
        color: "#111827",
      },

      // -------------------------------------------------
      // Payment success
      // -------------------------------------------------

      handler: async function (
        response
      ) {
        try {
          setLoading(true);



          // ---------------------------------------------
          // Verify payment on backend
          // ---------------------------------------------

          const verificationResponse =
            await verifyRazorpayPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              shippingAddress:
                finalShippingAddress,

              couponCode,
            });



          // ---------------------------------------------
          // Check verification result
          // ---------------------------------------------

          if (
            verificationResponse?.success ===
            false
          ) {
            throw new Error(
              verificationResponse.message ||
                "Payment verification failed."
            );
          }

          // ---------------------------------------------
          // Payment verified
          // ---------------------------------------------

          dispatch(clearCart());

          toast.success(
            "Payment successful! Order placed."
          );

          navigate("/order-success");
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Payment verification failed."
          );
        } finally {
          setLoading(false);
        }
      },

      // -------------------------------------------------
      // Checkout modal closed
      // -------------------------------------------------

      modal: {
        ondismiss: function () {
          setLoading(false);

          toast.error(
            "Payment cancelled."
          );
        },
      },
    };

    // ---------------------------------------------------
    // Open Razorpay
    // ---------------------------------------------------

    const razorpay =
      new window.Razorpay(options);

    // ---------------------------------------------------
    // Payment failed
    // ---------------------------------------------------

    razorpay.on(
      "payment.failed",
      function (response) {
        console.error(
          "Razorpay payment failed:",
          response
        );

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      }
    );

    razorpay.open();
  };

  // =====================================================
  // MAIN PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    if (loading) {
      return;
    }

    // ---------------------------------------------------
    // Get shipping address
    // ---------------------------------------------------

    const finalShippingAddress =
      getFinalShippingAddress();

    // ---------------------------------------------------
    // Validate shipping address
    // ---------------------------------------------------

    if (
      !validateShippingAddress(
        finalShippingAddress
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // COD
      // =================================================

      if (paymentMethod === "COD") {
        await handleCODOrder(
          finalShippingAddress
        );

        return;
      }

      // =================================================
      // RAZORPAY
      // =================================================

      if (
        paymentMethod === "RAZORPAY"
      ) {
        await handleRazorpayOrder(
          finalShippingAddress
        );

        return;
      }

      // =================================================
      // UNKNOWN PAYMENT METHOD
      // =================================================

      toast.error(
        "Please select a valid payment method."
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to place order."
      );
    } finally {
      /*
       * For Razorpay:
       * Loading state is controlled by
       * Razorpay callback / modal.
       *
       * For COD:
       * Reset loading here.
       */

      if (
        paymentMethod === "COD"
      ) {
        setLoading(false);
      }
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <button
      type="button"
      className="place-order-btn"
      onClick={handlePlaceOrder}
      disabled={loading}
    >
      {loading
        ? paymentMethod === "RAZORPAY"
          ? "Processing Payment..."
          : "Placing Order..."
        : paymentMethod === "RAZORPAY"
        ? "Pay with Razorpay"
        : "Place Order"}
    </button>
  );
}