import React from "react";
import { useNavigate } from "react-router-dom";

export default function CartSummary({ items }) {
  const navigate = useNavigate();

  // Remove invalid/deleted products
  const validItems = items.filter((item) => item.product);

  const subtotal = validItems.reduce((total, item) => {
    const discount = Number(item.product.discount || 0);

    const price =
      item.product.price -
      (item.product.price * discount) / 100;

    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 2999 ? 0 : 199;

  const total = subtotal + shipping;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Items</span>
        <span>{validItems.length}</span>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>
          {shipping === 0 ? (
            <span className="free-shipping">FREE</span>
          ) : (
            `₹${shipping}`
          )}
        </span>
      </div>

      {shipping > 0 && (
        <p className="shipping-note">
          Add ₹{(2999 - subtotal).toLocaleString("en-IN")} more to get
          <strong> FREE Shipping</strong>.
        </p>
      )}

      <div className="summary-divider"></div>

      <div className="summary-row total">
        <span>Total</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </div>

      <button
        className="checkout-btn"
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}