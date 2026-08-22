import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const PrintShippingLabel = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const orderId = order?._id?.slice(-8).toUpperCase();

  return (
    <div ref={ref} className="shipping-label">

      {/* ================= HEADER ================= */}
      <div className="shipping-header">

        <div>
          <div className="shipping-brand">
            SOUK
          </div>

          <div className="shipping-brand-sub">
            FASHION HOUSE
          </div>
        </div>

        <div className="shipping-title">
          <strong>SHIPPING LABEL</strong>
          <span>E-COMMERCE ORDER</span>
        </div>

      </div>


      {/* ================= ORDER INFO ================= */}
      <div className="shipping-order-info">

        <div>
          <span>ORDER ID</span>
          <strong>#{orderId}</strong>
        </div>

        <div className="shipping-order-date">
          <span>ORDER DATE</span>
          <strong>
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </strong>
        </div>

      </div>


      {/* ================= PAYMENT ================= */}
      <div className="shipping-payment">

        <span>PAYMENT METHOD</span>

        <strong>
          {order.paymentMethod}
        </strong>

      </div>


      {/* ================= SHIP TO ================= */}
      <div className="shipping-section">

        <div className="shipping-section-title">
          SHIP TO
        </div>

        <div className="shipping-customer-name">
          {order.shippingAddress.fullName}
        </div>

        <div className="shipping-contact">
          📞 {order.shippingAddress.phone}
        </div>

        <div className="shipping-contact">
          ✉ {order.shippingAddress.email}
        </div>

        <div className="shipping-address">
          {order.shippingAddress.address}
        </div>

      </div>


      {/* ================= ITEMS ================= */}
      <div className="shipping-section">

        <div className="shipping-section-title">
          ORDER ITEMS
        </div>

        {order.items.map((item, index) => (

          <div
            key={item.product?._id || index}
            className="shipping-item"
          >

            <div className="shipping-item-name">

              <strong>
                {item.product?.name}
              </strong>

              {item.size && (
                <small>
                  Size: {item.size}
                </small>
              )}

              {item.color && (
                <small>
                  Color: {item.color}
                </small>
              )}

            </div>

            <strong>
              × {item.quantity}
            </strong>

          </div>

        ))}

      </div>


      {/* ================= TOTAL ================= */}
      <div className="shipping-total-section">

        <div className="shipping-payment-status">

          <span>
            Payment Status
          </span>

          <strong>
            {order.paymentStatus}
          </strong>

        </div>

        <div className="shipping-total">

          <span>
            TOTAL AMOUNT
          </span>

          <strong>
            ₹
            {Number(
              order.finalAmount || 0
            ).toLocaleString("en-IN")}
          </strong>

        </div>

      </div>


      {/* ================= BARCODE ================= */}
      <div className="shipping-barcode">

        <Barcode
          value={order._id}
          width={1.25}
          height={42}
          displayValue={true}
          fontSize={9}
          margin={0}
        />

        <div className="barcode-text">
          Scan for order identification
        </div>

      </div>


      {/* ================= FOOTER ================= */}
      <div className="shipping-footer">

        <strong>
          Thank you for shopping with SOUK
        </strong>

        <span>
          SOUK Fashion House • Packed with care
        </span>

      </div>

    </div>
  );
});

export default PrintShippingLabel;