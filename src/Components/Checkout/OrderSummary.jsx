import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Tag,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

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

  // --------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------

  const subtotal = items.reduce((total, item) => {
    const discount = Number(item.product.discount || 0);

    const price =
      Number(item.product.price) -
      (Number(item.product.price) * discount) / 100;

    return total + price * Number(item.quantity || 0);
  }, 0);

  // --------------------------------------------------
  // SHIPPING
  // --------------------------------------------------

  const shipping = subtotal >= 2999 ? 0 : 199;

  const total = subtotal + shipping;

  // --------------------------------------------------
  // COUPON
  // --------------------------------------------------

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    try {
      setLoading(true);

      const response = await applyCoupon({
        code: couponCode.trim().toUpperCase(),
        cartTotal: subtotal,
      });

      setDiscountAmount(Number(response.discount || 0));
      setFinalAmount(Number(response.finalAmount || 0));
      setCouponApplied(true);

      toast.success("Coupon applied successfully!");
    } catch (error) {
      setCouponApplied(false);
      setDiscountAmount(0);
      setFinalAmount(null);

      toast.error(
        error.response?.data?.message ||
          "Invalid or expired coupon."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // REMOVE COUPON
  // --------------------------------------------------

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setFinalAmount(null);
    setCouponApplied(false);

    toast.success("Coupon removed.");
  };

  // --------------------------------------------------
  // FINAL DISPLAY TOTAL
  // --------------------------------------------------

  const displayTotal = couponApplied
    ? Number(finalAmount || 0) + shipping
    : total;

  return (
    <div className="checkout-card order-summary-card">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="order-summary-header">

        <div className="order-summary-title-wrapper">

          <div className="order-summary-icon">
            <ShoppingBag
              size={20}
              strokeWidth={2}
            />
          </div>

          <div>
            <h3 className="checkout-title mb-0">
              Order Summary
            </h3>

            <p className="order-summary-subtitle">
              Review your items before placing your order
            </p>
          </div>

        </div>

        <div className="order-item-count">
          {items.length}{" "}
          {items.length === 1 ? "item" : "items"}
        </div>

      </div>

      {/* ================================================
          PRODUCTS
      ================================================= */}

      <div className="checkout-products">

        {items.length === 0 ? (

          <div className="empty-cart-summary">
            <ShoppingBag size={30} />
            <p>Your cart is empty.</p>
          </div>

        ) : (

          items.map((item, index) => {

            const discount = Number(
              item.product.discount || 0
            );

            const originalPrice = Number(
              item.product.price || 0
            );

            const price =
              originalPrice -
              (originalPrice * discount) / 100;

            /*
              IMPORTANT:

              Do NOT use only product._id as key.

              Same product can exist with different
              sizes/colors.
            */

            const itemKey =
              item._id ||
              item.cartItemId ||
              `${item.product._id}-${item.size || "no-size"}-${
                item.color || "no-color"
              }-${index}`;

            return (
              <div
                className="checkout-product"
                key={itemKey}
              >

                {/* Product Image */}

                <div className="checkout-product-image-wrapper">

                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="checkout-product-image"
                  />

                  <span className="checkout-product-quantity">
                    {item.quantity}
                  </span>

                </div>

                {/* Product Details */}

                <div className="checkout-product-info">

                  <h5>
                    {item.product.name}
                  </h5>

                  <div className="checkout-product-meta">

                    {item.size && (
                      <span>
                        Size: <strong>{item.size}</strong>
                      </span>
                    )}

                    {item.color && (
                      <span>
                        Color: <strong>{item.color}</strong>
                      </span>
                    )}

                  </div>

                  <div className="checkout-product-price">

                    {discount > 0 && (
                      <span className="checkout-original-price">
                        ₹
                        {originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                    <strong>
                      ₹
                      {(
                        price * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>

              </div>
            );
          })

        )}

      </div>

      {/* ================================================
          COUPON
      ================================================= */}

      <div className="checkout-coupon">

        <div className="coupon-heading">

          <div className="coupon-icon">
            <Tag size={17} />
          </div>

          <div>
            <strong>Coupon Code</strong>

            <small>
              Have a promo code?
            </small>
          </div>

        </div>

        {!couponApplied ? (

          <div className="coupon-input-wrapper">

            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(
                  e.target.value.toUpperCase()
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyCoupon();
                }
              }}
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={loading}
            >
              {loading ? (
                "Applying..."
              ) : (
                <>
                  Apply
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </div>

        ) : (

          <div className="coupon-applied-box">

            <div className="coupon-success">

              <CheckCircle2 size={18} />

              <div>
                <strong>
                  {couponCode}
                </strong>

                <small>
                  Coupon applied successfully
                </small>
              </div>

            </div>

            <button
              type="button"
              onClick={handleRemoveCoupon}
            >
              Remove
            </button>

          </div>

        )}

      </div>

      {/* ================================================
          PRICE BREAKDOWN
      ================================================= */}

      <div className="summary-divider" />

      <div className="summary-breakdown">

        <div className="summary-row">

          <span>Subtotal</span>

          <strong>
            ₹
            {subtotal.toLocaleString("en-IN")}
          </strong>

        </div>

        <div className="summary-row">

          <span className="shipping-label">

            <Truck size={15} />

            Shipping

          </span>

          <strong
            className={
              shipping === 0
                ? "shipping-free"
                : ""
            }
          >
            {shipping === 0
              ? "FREE"
              : `₹${shipping.toLocaleString(
                  "en-IN"
                )}`}
          </strong>

        </div>

        {couponApplied && (
          <div className="summary-row discount-row">

            <span>
              Discount
            </span>

            <strong>
              -₹
              {Number(
                discountAmount || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>
        )}

      </div>

      {/* ================================================
          TOTAL
      ================================================= */}

      <div className="summary-total">

        <div>

          <span>Total Amount</span>

          <small>
            Inclusive of applicable charges
          </small>

        </div>

        <strong>
          ₹
          {displayTotal.toLocaleString(
            "en-IN"
          )}
        </strong>

      </div>

      {/* ================================================
          SECURITY
      ================================================= */}

      <div className="checkout-security">

        <ShieldCheck size={17} />

        <span>
          Secure checkout · Your information is protected
        </span>

      </div>

    </div>
  );
}