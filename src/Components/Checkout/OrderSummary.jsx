import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { applyCoupon } from "../../features/coupon/couponApi";

export default function OrderSummary({
  couponCode,
  setCouponCode,
  discountAmount,
  setDiscountAmount,
  finalAmount,
  setFinalAmount,
  couponApplied,
  setCouponApplied,
}) {
  const { items } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((total, item) => {
    const discount = Number(item.product.discount || 0);

    const price =
      item.product.price -
      (item.product.price * discount) / 100;

    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 2999 ? 0 : 199;

  const total = subtotal + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    try {
      setLoading(true);

      const response = await applyCoupon({
        code: couponCode,
        cartTotal: subtotal,
      });

      setDiscountAmount(response.discount);
      setFinalAmount(response.finalAmount);
      setCouponApplied(true);

      toast.success("Coupon applied successfully!");
    } catch (error) {
      setCouponApplied(false);
      setDiscountAmount(0);
      setFinalAmount(null);

      toast.error(
        error.response?.data?.message || "Invalid coupon."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-card">
      <h3 className="checkout-title">
        Order Summary
      </h3>

      <div className="checkout-products">
        {items.map((item) => {
          const discount = Number(item.product.discount || 0);

          const price =
            item.product.price -
            (item.product.price * discount) / 100;

          return (
            <div
              className="checkout-product"
              key={item.product._id}
            >
              <div className="checkout-product-info">
                <h5>{item.product.name}</h5>

                <p>Qty: {item.quantity}</p>

                {discount > 0 && (
                  <small className="text-decoration-line-through text-muted">
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </small>
                )}
              </div>

              <span>
                ₹{(price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Coupon Section */}

      <div className="mt-4">
        <label className="form-label fw-semibold">
          Coupon Code
        </label>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) =>
              setCouponCode(e.target.value.toUpperCase())
            }
          />

          <button
            type="button"
            className="btn btn-dark"
            onClick={handleApplyCoupon}
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>

        {couponApplied && (
          <small className="text-success mt-2 d-block">
            Coupon applied successfully.
          </small>
        )}
      </div>

      <hr />

      <div className="summary-row">
        <span>Subtotal</span>

        <span>
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>

        <span>
          {shipping === 0
            ? "FREE"
            : `₹${shipping}`}
        </span>
      </div>

      {couponApplied && (
        <div className="summary-row text-success">
          <span>Discount</span>

          <span>
            -₹{discountAmount.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      <div className="summary-row total">
        <span>Total</span>

        <strong>
          ₹{(finalAmount ?? total).toLocaleString("en-IN")}
        </strong>
      </div>
    </div>
  );
}