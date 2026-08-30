import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const PrintShippingLabel = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const orderId = order?._id
    ? order._id.slice(-8).toUpperCase()
    : "--------";

  const shippingAddress = order?.shippingAddress || {};

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const paymentMethod = String(order?.paymentMethod || "-");
  const paymentStatus = String(order?.paymentStatus || "-");

  const total = Number(order?.finalAmount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const items = Array.isArray(order?.items) ? order.items : [];
  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0
  );

  return (
    <div ref={ref} className="sf-print-label">
      <div className="sf-label-page">
        {/* =========================================================
            PREMIUM SHIPPING LABEL HEADER
        ========================================================== */}
        <header className="sf-label-header">
          <div className="sf-brand-block">
            <div className="sf-brand-mark">S</div>

            <div>
              <div className="sf-brand">SOUK</div>
              <div className="sf-brand-sub">FASHION HOUSE</div>
              <div className="sf-brand-location">DELHI, INDIA</div>
            </div>
          </div>

          <div className="sf-label-title-block">
            <div className="sf-label-title">SHIPMENT</div>
            <div className="sf-label-title-sub">DELIVERY LABEL</div>
          </div>
        </header>

        {/* =========================================================
            ORDER IDENTIFICATION
        ========================================================== */}
        <section className="sf-order-strip">
          <div className="sf-order-number">
            <span className="sf-meta-label">ORDER ID</span>
            <strong>#{orderId}</strong>
          </div>

          <div className="sf-order-meta-right">
            <div>
              <span className="sf-meta-label">DATE</span>
              <strong>{orderDate}</strong>
            </div>

            <div>
              <span className="sf-meta-label">ITEMS</span>
              <strong>{totalQuantity}</strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            SHIP TO — MAIN FOCUS
        ========================================================== */}
        <section className="sf-ship-to">
          <div className="sf-section-label">
            <span className="sf-section-accent" />
            SHIP TO
          </div>

          <div className="sf-recipient-name">
            {shippingAddress.fullName || "-"}
          </div>

          <div className="sf-address-main">
            {shippingAddress.address || "-"}
          </div>

          <div className="sf-recipient-contact">
            {shippingAddress.phone && (
              <span>
                <b>T</b> {shippingAddress.phone}
              </span>
            )}

            {shippingAddress.email && (
              <span className="sf-email">
                <b>E</b> {shippingAddress.email}
              </span>
            )}
          </div>
        </section>

        {/* =========================================================
            ORDER CONTENT
        ========================================================== */}
        <section className="sf-items-section">
          <div className="sf-section-heading">
            <div className="sf-section-label">
              <span className="sf-section-accent" />
              ORDER CONTENT
            </div>

            <span className="sf-item-count">
              {items.length} {items.length === 1 ? "PRODUCT" : "PRODUCTS"}
            </span>
          </div>

          <div className="sf-items-list">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item?.product?._id || item?._id || index}
                  className="sf-item-row"
                >
                  <div className="sf-item-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="sf-item-details">
                    <div className="sf-item-name">
                      {item?.product?.name || item?.name || "-"}
                    </div>

                    <div className="sf-item-options">
                      {item?.size && <span>SIZE {item.size}</span>}
                      {item?.color && <span>COLOR {item.color}</span>}
                    </div>
                  </div>

                  <div className="sf-item-qty">
                    ×{Number(item?.quantity || 0)}
                  </div>
                </div>
              ))
            ) : (
              <div className="sf-no-items">No items</div>
            )}
          </div>
        </section>

        {/* =========================================================
            PAYMENT + TOTAL
        ========================================================== */}
        <section className="sf-bottom-summary">
          <div className="sf-payment-block">
            <span className="sf-small-label">PAYMENT</span>

            <div className="sf-payment-line">
              <strong>{paymentMethod.toUpperCase()}</strong>

              <span
                className={`sf-payment-status sf-payment-${paymentStatus
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>

          <div className="sf-total-block">
            <span className="sf-small-label">ORDER TOTAL</span>
            <strong className="sf-total-value">₹{total}</strong>
          </div>
        </section>

        {/* =========================================================
            BARCODE
        ========================================================== */}
        <section className="sf-barcode-section">
          <div className="sf-barcode-box">
            <Barcode
              value={order?._id || orderId || "ORDER"}
              width={1.15}
              height={30}
              displayValue={true}
              fontSize={7}
              textMargin={2}
              margin={0}
              background="#ffffff"
              lineColor="#172238"
            />
          </div>

          <div className="sf-barcode-caption">
            SCAN TO IDENTIFY SHIPMENT
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================== */}
        <footer className="sf-label-footer">
          <div className="sf-footer-brand">SOUK FASHION HOUSE</div>
          <div className="sf-footer-sub">
            Thank you for shopping with us
          </div>
        </footer>
      </div>

      <style>{`
        /* ============================================================
           SOUK PREMIUM SHIPPING LABEL
           Physical print size: 100mm × 150mm
        ============================================================ */

        .sf-print-label {
          width: 100mm;
          height: 150mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #172238;
          box-sizing: border-box;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
        }

        .sf-print-label *,
        .sf-print-label *::before,
        .sf-print-label *::after {
          box-sizing: border-box;
        }

        .sf-label-page {
          width: 100mm;
          height: 150mm;
          margin: 0;
          padding: 5mm;
          background: #ffffff;
          color: #172238;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          font-size: 8px;
          line-height: 1.25;
        }

        /* ============================================================
           HEADER
        ============================================================ */

        .sf-label-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 3mm;

          padding-bottom: 3.5mm;
          border-bottom: 1.4px solid #172238;

          flex-shrink: 0;
        }

        .sf-brand-block {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 2.5mm;
        }

        .sf-brand-mark {
          width: 9.5mm;
          height: 9.5mm;
          flex: 0 0 9.5mm;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #c7a65a;
          border-radius: 50%;

          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          font-weight: 700;
        }

        .sf-brand {
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          line-height: 0.9;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .sf-brand-sub {
          margin-top: 1.2mm;
          color: #9a7c3f;
          font-size: 4.4px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .sf-brand-location {
          margin-top: 1.1mm;
          color: #89919d;
          font-size: 4.7px;
          line-height: 1;
          letter-spacing: 0.4px;
        }

        .sf-label-title-block {
          padding-top: 0.5mm;
          text-align: right;
          min-width: 0;
        }

        .sf-label-title {
          color: #172238;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .sf-label-title-sub {
          margin-top: 1.2mm;
          color: #9a7c3f;
          font-size: 4.6px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        /* ============================================================
           ORDER STRIP
        ============================================================ */

        .sf-order-strip {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 2.7mm 0;
          border-bottom: 1px solid #d9dde2;

          flex-shrink: 0;
        }

        .sf-order-number {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1mm;
        }

        .sf-order-number strong {
          color: #172238;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.4px;
        }

        .sf-order-meta-right {
          display: flex;
          align-items: center;
          gap: 5mm;
        }

        .sf-order-meta-right > div {
          display: flex;
          flex-direction: column;
          gap: 1mm;
          text-align: right;
        }

        .sf-meta-label {
          color: #8b94a0;
          font-size: 4.7px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .sf-order-meta-right strong {
          color: #364154;
          font-size: 6.7px;
          line-height: 1;
          font-weight: 800;
        }

        /* ============================================================
           SHIP TO
        ============================================================ */

        .sf-ship-to {
          width: 100%;
          padding: 4mm 3.5mm;
          margin-top: 3mm;

          border: 1px solid #dfe3e7;
          border-left: 3px solid #c7a65a;

          background: #fbfbfa;
          border-radius: 1.5px;

          flex-shrink: 0;
          min-width: 0;
        }

        .sf-section-label {
          display: flex;
          align-items: center;
          gap: 1.5mm;

          color: #8c7240;
          font-size: 5.2px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sf-section-accent {
          width: 4mm;
          height: 1px;
          flex: 0 0 4mm;
          background: #c7a65a;
        }

        .sf-recipient-name {
          margin-top: 2.5mm;

          color: #172238;
          font-size: 12px;
          line-height: 1.05;
          font-weight: 850;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-address-main {
          margin-top: 1.7mm;

          color: #4e5969;
          font-size: 7.4px;
          line-height: 1.4;
          font-weight: 500;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-recipient-contact {
          margin-top: 2.2mm;
          padding-top: 2mm;

          display: flex;
          flex-wrap: wrap;
          gap: 2.5mm;

          border-top: 1px solid #e4e7ea;

          color: #697383;
          font-size: 6px;
          line-height: 1.2;
        }

        .sf-recipient-contact span {
          max-width: 100%;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-recipient-contact b {
          color: #8c7240;
          font-size: 5px;
          margin-right: 0.7mm;
        }

        /* ============================================================
           ITEMS
        ============================================================ */

        .sf-items-section {
          width: 100%;
          padding: 3mm 0 2.5mm;

          border-bottom: 1px solid #d9dde2;

          flex: 1 1 auto;
          min-height: 0;

          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sf-section-heading {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 1.5mm;
          flex-shrink: 0;
        }

        .sf-item-count {
          color: #9aa2ad;
          font-size: 5px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .sf-items-list {
          width: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .sf-item-row {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 2mm;

          padding: 1.7mm 0;

          border-bottom: 1px dotted #cfd4d9;
        }

        .sf-item-row:last-child {
          border-bottom: 0;
        }

        .sf-item-index {
          flex: 0 0 5mm;

          color: #a1a8b1;
          font-size: 5.5px;
          line-height: 1.3;
          font-weight: 700;
        }

        .sf-item-details {
          flex: 1 1 auto;
          min-width: 0;
        }

        .sf-item-name {
          color: #263247;
          font-size: 7.4px;
          line-height: 1.25;
          font-weight: 800;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-item-options {
          display: flex;
          flex-wrap: wrap;
          gap: 2mm;

          margin-top: 0.9mm;

          color: #858e9b;
          font-size: 5px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .sf-item-qty {
          flex: 0 0 auto;

          padding: 1mm 1.5mm;

          border: 1px solid #dfe3e7;
          border-radius: 10px;

          color: #172238;
          background: #ffffff;

          font-size: 6.5px;
          line-height: 1;
          font-weight: 900;

          white-space: nowrap;
        }

        .sf-no-items {
          padding: 2mm 0;
          color: #7d8794;
          font-size: 6.5px;
        }

        /* ============================================================
           PAYMENT + TOTAL
        ============================================================ */

        .sf-bottom-summary {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4mm;
          align-items: center;

          padding: 2.8mm 0;

          border-bottom: 1.4px solid #172238;

          flex-shrink: 0;
        }

        .sf-payment-block {
          min-width: 0;
        }

        .sf-small-label {
          display: block;
          color: #8c7240;
          font-size: 4.8px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .sf-payment-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 2mm;
          margin-top: 1.3mm;
        }

        .sf-payment-line strong {
          color: #263247;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
        }

        .sf-payment-status {
          padding: 1mm 1.7mm;
          border-radius: 10px;

          background: #edf0f3;
          color: #566172;

          font-size: 4.8px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .sf-payment-paid,
        .sf-payment-completed,
        .sf-payment-success {
          background: #e6f4ed;
          color: #19734d;
        }

        .sf-payment-pending {
          background: #fff1d0;
          color: #916b20;
        }

        .sf-payment-failed,
        .sf-payment-cancelled,
        .sf-payment-canceled {
          background: #fbe7e7;
          color: #a33d3d;
        }

        .sf-total-block {
          text-align: right;
          flex-shrink: 0;
        }

        .sf-total-value {
          display: block;
          margin-top: 1.1mm;

          color: #172238;
          font-size: 13px;
          line-height: 1;
          font-weight: 900;
          white-space: nowrap;
        }

        /* ============================================================
           BARCODE
        ============================================================ */

        .sf-barcode-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          padding-top: 2.5mm;

          flex-shrink: 0;
          overflow: hidden;
        }

        .sf-barcode-box {
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .sf-barcode-box svg {
          display: block;
          width: auto !important;
          max-width: 100% !important;
          height: auto;
        }

        .sf-barcode-caption {
          margin-top: 1mm;

          color: #89919d;
          font-size: 4.5px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          text-align: center;
        }

        /* ============================================================
           FOOTER
        ============================================================ */

        .sf-label-footer {
          width: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;

          padding-top: 2.2mm;

          text-align: center;
          flex-shrink: 0;
        }

        .sf-footer-brand {
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 6px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .sf-footer-sub {
          margin-top: 1mm;
          color: #9aa2ad;
          font-size: 4.6px;
          line-height: 1;
        }

        /* ============================================================
           PRINT
        ============================================================ */

        @media print {
          @page {
            size: 100mm 150mm;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: auto !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          .sf-print-label {
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            background: #ffffff !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .sf-label-page {
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 5mm !important;
            display: flex !important;
            flex-direction: column !important;
            background: #ffffff !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .sf-label-header,
          .sf-order-strip,
          .sf-ship-to,
          .sf-items-section,
          .sf-bottom-summary,
          .sf-barcode-section,
          .sf-label-footer {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
});

PrintShippingLabel.displayName = "PrintShippingLabel";

export default PrintShippingLabel;
