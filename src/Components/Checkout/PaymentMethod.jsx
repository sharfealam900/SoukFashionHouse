import React from "react";

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <div className="checkout-card">
      <h3 className="checkout-title">
        Payment Method
      </h3>

      <div className="payment-options">

        {/* COD */}
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />

          <span>
            Cash on Delivery
          </span>
        </label>

        {/* Razorpay */}
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="RAZORPAY"
            checked={paymentMethod === "RAZORPAY"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />

          <span>
            Razorpay (UPI / Card / Net Banking)
          </span>
        </label>

      </div>
    </div>
  );
}