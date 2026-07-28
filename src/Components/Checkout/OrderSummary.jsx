import React from "react";
import { useSelector } from "react-redux";

export default function OrderSummary() {
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce((total, item) => {
    const discount = Number(item.product.discount || 0);

    const price =
      item.product.price -
      (item.product.price * discount) / 100;

    return total + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 2999 ? 0 : 199;
  const total = subtotal + shipping;

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

                <p>
                  Qty: {item.quantity}
                </p>

                {discount > 0 && (
                  <small
                    className="text-muted text-decoration-line-through"
                  >
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

      <hr />

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>

        <span>
          {shipping === 0 ? "FREE" : `₹${shipping}`}
        </span>
      </div>

      <div className="summary-row total">
        <span>Total</span>

        <strong>
          ₹{total.toLocaleString("en-IN")}
        </strong>
      </div>

    </div>
  );
}