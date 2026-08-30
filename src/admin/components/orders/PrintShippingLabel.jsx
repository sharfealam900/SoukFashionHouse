import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const PrintShippingLabel = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const orderId = order?._id
    ? order._id.slice(-8).toUpperCase()
    : "";

  const shippingAddress = order?.shippingAddress || {};

  return (
    <div ref={ref} className="shipping-label-print">
      <div className="shipping-label">
        <div className="shipping-header">
          <div>
            <div className="shipping-brand">SOUK</div>
            <div className="shipping-brand-sub">FASHION HOUSE</div>
          </div>

          <div className="shipping-title">
            <strong>SHIPPING LABEL</strong>
            <span>E-COMMERCE ORDER</span>
          </div>
        </div>

        <div className="shipping-order-info">
          <div>
            <span>ORDER ID</span>
            <strong>#{orderId}</strong>
          </div>

          <div>
            <span>ORDER DATE</span>
            <strong>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

          <div>
            <span>PAYMENT</span>
            <strong>{order.paymentMethod || "-"}</strong>
          </div>
        </div>

        <div className="shipping-section">
          <div className="shipping-section-title">SHIP TO</div>

          <div className="shipping-customer-name">
            {shippingAddress.fullName || "-"}
          </div>

          {shippingAddress.phone && (
            <div className="shipping-contact">
              {shippingAddress.phone}
            </div>
          )}

          {shippingAddress.email && (
            <div className="shipping-contact">
              {shippingAddress.email}
            </div>
          )}

          <div className="shipping-address">
            {shippingAddress.address || "-"}
          </div>
        </div>

        <div className="shipping-section">
          <div className="shipping-section-title">ORDER ITEMS</div>

          {order.items?.map((item, index) => (
            <div
              key={item.product?._id || index}
              className="shipping-item"
            >
              <div className="shipping-item-name">
                <strong>{item.product?.name || "-"}</strong>

                {item.size && (
                  <small>Size: {item.size}</small>
                )}

                {item.color && (
                  <small>Color: {item.color}</small>
                )}
              </div>

              <strong>× {item.quantity || 0}</strong>
            </div>
          ))}
        </div>

        <div className="shipping-total-section">
          <div className="shipping-payment-status">
            <span>Payment Status</span>
            <strong>{order.paymentStatus || "-"}</strong>
          </div>

          <div className="shipping-total">
            <span>TOTAL</span>
            <strong>
              ₹
              {Number(order.finalAmount || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="shipping-barcode">
          <Barcode
            value={order._id || orderId}
            width={1.2}
            height={45}
            displayValue={true}
            fontSize={9}
            margin={0}
          />

          <div>Scan for order identification</div>
        </div>

        <div className="shipping-footer">
          <strong>Thank you for shopping with SOUK</strong>
          <span>SOUK Fashion House • Packed with care</span>
        </div>
      </div>

      <style>{`
        .shipping-label-print {
          width: 100mm;
          height: 150mm;
          margin: 0;
          padding: 0;
          background: #fff;
          color: #000;
          box-sizing: border-box;
        }

        .shipping-label {
          width: 100mm;
          min-height: 150mm;
          max-height: 150mm;
          padding: 7mm;
          box-sizing: border-box;
          background: #fff;
          color: #000;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          line-height: 1.25;
          overflow: hidden;
        }

        .shipping-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          padding-bottom: 5px;
          border-bottom: 1.5px solid #000;
        }

        .shipping-brand {
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }

        .shipping-brand-sub {
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 1.4px;
          margin-top: 2px;
        }

        .shipping-title {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .shipping-title strong {
          font-size: 10px;
        }

        .shipping-title span {
          font-size: 6px;
          letter-spacing: 0.5px;
        }

        .shipping-order-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 5px;
          padding: 6px 0;
          border-bottom: 1px solid #aaa;
        }

        .shipping-order-info > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .shipping-order-info span,
        .shipping-section-title,
        .shipping-total span,
        .shipping-payment-status span {
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .shipping-order-info strong {
          font-size: 8px;
          word-break: break-word;
        }

        .shipping-section {
          margin-top: 6px;
          padding-bottom: 5px;
          border-bottom: 1px solid #aaa;
        }

        .shipping-section-title {
          margin-bottom: 4px;
        }

        .shipping-customer-name {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .shipping-contact {
          font-size: 8px;
          overflow-wrap: anywhere;
        }

        .shipping-address {
          margin-top: 3px;
          font-size: 8px;
          line-height: 1.3;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .shipping-item {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 3px 0;
          border-bottom: 1px dotted #bbb;
        }

        .shipping-item-name {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .shipping-item-name strong {
          font-size: 8px;
          overflow-wrap: anywhere;
        }

        .shipping-item-name small {
          font-size: 7px;
          color: #333;
        }

        .shipping-item > strong {
          white-space: nowrap;
          font-size: 8px;
        }

        .shipping-total-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 10px;
          margin-top: 7px;
          padding-top: 5px;
          border-top: 1.5px solid #000;
        }

        .shipping-payment-status {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .shipping-payment-status strong {
          font-size: 8px;
          text-transform: uppercase;
        }

        .shipping-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .shipping-total strong {
          font-size: 12px;
        }

        .shipping-barcode {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }

        .shipping-barcode svg {
          max-width: 100%;
          height: auto;
        }

        .shipping-barcode > div {
          margin-top: 2px;
          font-size: 6px;
        }

        .shipping-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin-top: 6px;
          padding-top: 5px;
          border-top: 1px solid #aaa;
          text-align: center;
        }

        .shipping-footer strong {
          font-size: 7px;
        }

        .shipping-footer span {
          font-size: 6px;
        }

        @media print {
          @page {
            size: 100mm 150mm;
            margin: 0;
          }

          html,
          body {
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden;
          }

          .shipping-label-print,
          .shipping-label-print * {
            visibility: visible;
          }

          .shipping-label-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .shipping-label {
            width: 100mm !important;
            height: 150mm !important;
            min-height: 150mm !important;
            max-height: 150mm !important;
            margin: 0 !important;
            padding: 7mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
});

PrintShippingLabel.displayName = "PrintShippingLabel";

export default PrintShippingLabel;