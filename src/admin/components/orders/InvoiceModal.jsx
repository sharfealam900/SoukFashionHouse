import React, { forwardRef } from "react";

const PrintInvoice = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const invoiceNumber = order?._id
    ? order._id.slice(-8).toUpperCase()
    : "------";

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const shippingAddress = order?.shippingAddress || {};
  const items = Array.isArray(order?.items) ? order.items : [];

  const subtotal = Number(order?.totalAmount || 0);
  const discount = Number(order?.discountAmount || 0);
  const finalAmount = Number(order?.finalAmount || 0);

  const paymentMethod = String(order?.paymentMethod || "-");
  const paymentStatus = String(order?.paymentStatus || "-");

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const customerName = shippingAddress.fullName || "-";
  const customerPhone = shippingAddress.phone || "-";
  const customerEmail = shippingAddress.email || "-";
  const customerAddress = shippingAddress.address || "-";

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0
  );

  return (
    <div ref={ref} className="sf-invoice-print">
      <div className="sf-invoice-page">
        {/* ================= HEADER ================= */}
        <header className="sf-invoice-header">
          <div className="sf-brand-block">
            <div className="sf-brand-mark">S</div>
            <div>
              <div className="sf-brand-name">SOUK</div>
              <div className="sf-brand-subtitle">FASHION HOUSE</div>
              <div className="sf-brand-location">Delhi, India</div>
            </div>
          </div>

          <div className="sf-invoice-meta">
            <div className="sf-invoice-kicker">TAX INVOICE</div>
            <div className="sf-invoice-number">#{invoiceNumber}</div>

            <div className="sf-meta-grid">
              <div>
                <span>Invoice Date</span>
                <strong>{orderDate}</strong>
              </div>
              <div>
                <span>Order ID</span>
                <strong>{invoiceNumber}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* ================= CUSTOMER / PAYMENT ================= */}
        <section className="sf-info-grid">
          <div className="sf-info-card sf-customer-card">
            <div className="sf-section-label">Billed To</div>
            <div className="sf-customer-name">{customerName}</div>
            <div className="sf-contact-line">{customerPhone}</div>
            <div className="sf-contact-line sf-wrap">{customerEmail}</div>

            <div className="sf-address">
              <span className="sf-address-label">Shipping Address</span>
              <span className="sf-wrap">{customerAddress}</span>
            </div>
          </div>

          <div className="sf-info-card sf-payment-card">
            <div className="sf-section-label">Payment Details</div>

            <div className="sf-payment-detail">
              <span>Method</span>
              <strong>{paymentMethod.toUpperCase()}</strong>
            </div>

            <div className="sf-payment-detail">
              <span>Status</span>
              <span
                className={`sf-status-badge sf-status-${paymentStatus
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {paymentStatus}
              </span>
            </div>

            <div className="sf-payment-detail sf-payment-last">
              <span>Invoice No.</span>
              <strong>#{invoiceNumber}</strong>
            </div>
          </div>
        </section>

        {/* ================= ITEMS ================= */}
        <section className="sf-items-section">
          <div className="sf-table-heading">
            <div>
              <div className="sf-section-label">Order Summary</div>
              <div className="sf-table-title">Purchased Items</div>
            </div>

            <div className="sf-item-count">
              {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
              {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
            </div>
          </div>

          <div className="sf-order-table">
            <div className="sf-order-row sf-order-head">
              <div>#</div>
              <div>Product Description</div>
              <div className="sf-center">Size</div>
              <div className="sf-center">Color</div>
              <div className="sf-center">Qty</div>
              <div className="sf-money">Rate</div>
              <div className="sf-money">Amount</div>
            </div>

            {items.length > 0 ? (
              items.map((item, index) => {
                const price = Number(item?.price || 0);
                const quantity = Number(item?.quantity || 0);
                const itemTotal = price * quantity;

                return (
                  <div
                    key={item?.product?._id || item?._id || index}
                    className="sf-order-row sf-order-body"
                  >
                    <div className="sf-row-number">{index + 1}</div>

                    <div className="sf-product-cell">
                      <div className="sf-product-name">
                        {item?.product?.name || item?.name || "-"}
                      </div>
                    </div>

                    <div className="sf-center">{item?.size || "-"}</div>
                    <div className="sf-center">{item?.color || "-"}</div>
                    <div className="sf-center">{quantity}</div>

                    <div className="sf-money sf-price-cell">
                      {formatCurrency(price)}
                    </div>

                    <div className="sf-money sf-line-total">
                      {formatCurrency(itemTotal)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sf-empty-row">No items found in this order.</div>
            )}
          </div>
        </section>

        {/* ================= TOTALS ================= */}
        <section className="sf-summary-section">
          <div className="sf-summary-note">
            <div className="sf-note-title">Thank you for shopping with SOUK.</div>
            <div className="sf-note-text">
              We appreciate your order and hope you enjoy your purchase. For any queries, please reach out to our support team.
            </div>
          </div>

          <div className="sf-totals-box">
            <div className="sf-total-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            {discount > 0 && (
              <div className="sf-total-row sf-discount-row">
                <span>Discount</span>
                <strong>-{formatCurrency(discount)}</strong>
              </div>
            )}

            <div className="sf-total-divider" />

            <div className="sf-grand-total">
              <div>
                <span>Grand Total</span>
                <small>Inclusive of all taxes</small>
              </div>
              <strong>{formatCurrency(finalAmount)}</strong>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="sf-invoice-footer">
          <div className="sf-footer-brand">SOUK FASHION HOUSE</div>
          <div className="sf-footer-contact">
            Delhi, India <span>•</span> support@soukfashionhouse.com
          </div>
          <div className="sf-footer-rule" />
          <div className="sf-footer-copy">
            This is a computer-generated invoice and does not require a physical signature.
          </div>
        </footer>
      </div>

      <style>{`
        .sf-invoice-print,
        .sf-invoice-print * {
          box-sizing: border-box;
        }

        .sf-invoice-print {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          background: #fff;
          color: #172238;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .sf-invoice-page {
          width: 210mm;
          height: 297mm;
          padding: 14mm 14mm 12mm;
          display: flex;
          flex-direction: column;
          background: #fff;
          font-size: 11.5px;
          line-height: 1.5;
        }

        /* HEADER */
        .sf-invoice-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 6mm;
          border-bottom: 2px solid #172238;
          flex-shrink: 0;
        }

        .sf-brand-block {
          display: flex;
          align-items: center;
          gap: 4mm;
        }

        .sf-brand-mark {
          width: 14mm;
          height: 14mm;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #c7a65a;
          border-radius: 50%;
          color: #172238;
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          background: #fdfbf7;
        }

        .sf-brand-name {
          color: #172238;
          font-family: Georgia, serif;
          font-size: 28px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 2.5px;
        }

        .sf-brand-subtitle {
          margin-top: 1.5mm;
          color: #8d7440;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 2.2px;
        }

        .sf-brand-location {
          margin-top: 1.5mm;
          color: #64748b;
          font-size: 9px;
        }

        .sf-invoice-meta {
          text-align: right;
        }

        .sf-invoice-kicker {
          color: #8d7440;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .sf-invoice-number {
          margin-top: 1mm;
          color: #172238;
          font-size: 18px;
          font-weight: 900;
        }

        .sf-meta-grid {
          margin-top: 3.5mm;
          display: grid;
          grid-template-columns: auto auto;
          gap: 6mm;
        }

        .sf-meta-grid div {
          display: flex;
          flex-direction: column;
          gap: 0.5mm;
        }

        .sf-meta-grid span {
          color: #64748b;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .sf-meta-grid strong {
          color: #1e293b;
          font-size: 9.5px;
          font-weight: 800;
        }

        /* CUSTOMER / PAYMENT INFO GRID */
        .sf-info-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1.6fr 0.9fr;
          gap: 5mm;
          margin-top: 6mm;
          margin-bottom: 6mm;
          flex-shrink: 0;
        }

        .sf-info-card {
          padding: 5mm 5.5mm;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: #fafaf9;
        }

        .sf-customer-card {
          border-left: 3.5px solid #c7a65a;
        }

        .sf-section-label {
          color: #8b7444;
          font-size: 7.5px;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .sf-customer-name {
          margin-top: 2.5mm;
          margin-bottom: 1.5mm;
          color: #172238;
          font-size: 14px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .sf-contact-line {
          color: #475569;
          font-size: 9.5px;
          line-height: 1.4;
        }

        .sf-wrap {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-address {
          margin-top: 3mm;
          padding-top: 2.5mm;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1mm;
          color: #334155;
          font-size: 9.5px;
        }

        .sf-address-label {
          color: #64748b;
          font-size: 7px;
          font-weight: 750;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .sf-payment-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sf-payment-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2mm 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .sf-payment-detail:first-of-type {
          margin-top: 1.5mm;
        }

        .sf-payment-detail span {
          color: #64748b;
          font-size: 8.5px;
        }

        .sf-payment-detail strong {
          color: #1e293b;
          font-size: 9.5px;
          font-weight: 850;
        }

        .sf-payment-last {
          border-bottom: 0;
        }

        .sf-status-badge {
          padding: 1mm 2.2mm;
          border-radius: 20px;
          background: #edf0f3;
          color: #475569;
          font-size: 7px !important;
          font-weight: 850 !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sf-status-paid,
        .sf-status-completed,
        .sf-status-success {
          background: #dcfce7;
          color: #166534;
        }

        .sf-status-pending {
          background: #fef9c3;
          color: #854d0e;
        }

        .sf-status-failed,
        .sf-status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        /* ORDER ITEMS TABLE */
        .sf-items-section {
          width: 100%;
          margin-bottom: 6mm;
          flex-shrink: 0;
        }

        .sf-table-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5mm;
        }

        .sf-table-title {
          margin-top: 1mm;
          color: #172238;
          font-family: Georgia, serif;
          font-size: 14px;
          font-weight: 700;
        }

        .sf-item-count {
          color: #64748b;
          font-size: 8.5px;
          font-weight: 650;
        }

        .sf-order-table {
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #cbd5e1;
        }

        /* 
          RE-BALANCED GRID COLUMNS:
          Ensures Rate and Amount have enough width (22% each) 
          so long currency values never get cut off.
        */
        .sf-order-row {
          width: 100%;
          display: grid;
          grid-template-columns: 5% 33% 7% 7% 6% 21% 21%;
          align-items: center;
        }

        .sf-order-head {
          background: #172238;
          color: #fff;
          min-height: 10.5mm;
        }

        .sf-order-head > div {
          padding: 2.5mm 2mm;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .sf-order-body {
          min-height: 13mm;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          font-size: 10px;
          background: #fff;
        }

        .sf-order-body > div {
          padding: 3mm 2mm;
        }

        .sf-order-body:last-child {
          border-bottom: none;
        }

        .sf-center {
          text-align: center;
          white-space: nowrap;
        }

        .sf-row-number {
          text-align: center;
          color: #64748b;
          font-weight: 650;
        }

        .sf-product-name {
          color: #172238;
          font-size: 10.5px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .sf-money {
          text-align: right;
          white-space: nowrap;
          padding-right: 3mm !important;
          font-variant-numeric: tabular-nums;
        }

        .sf-price-cell {
          color: #475569;
          font-weight: 650;
        }

        .sf-line-total {
          color: #172238;
          font-size: 10.5px;
          font-weight: 900;
        }

        .sf-empty-row {
          padding: 8mm;
          text-align: center;
          color: #64748b;
          font-size: 9.5px;
          background: #fff;
        }

        /* TOTALS & SUMMARY */
        .sf-summary-section {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 75mm;
          gap: 8mm;
          align-items: start;
          flex-shrink: 0;
        }

        .sf-summary-note {
          padding-top: 1mm;
        }

        .sf-note-title {
          color: #172238;
          font-family: Georgia, serif;
          font-size: 12px;
          font-weight: 700;
        }

        .sf-note-text {
          margin-top: 1.5mm;
          color: #64748b;
          font-size: 8.5px;
          line-height: 1.5;
          max-width: 75mm;
        }

        .sf-totals-box {
          width: 75mm;
          padding: 5mm 5.5mm;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: #fafaf9;
        }

        .sf-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5mm 0;
          color: #475569;
          font-size: 9.5px;
        }

        .sf-total-row strong {
          color: #1e293b;
          font-weight: 750;
        }

        .sf-discount-row,
        .sf-discount-row strong {
          color: #166534;
        }

        .sf-total-divider {
          height: 1px;
          margin: 2.5mm 0;
          background: #cbd5e1;
        }

        .sf-grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1mm;
        }

        .sf-grand-total span {
          color: #172238;
          font-size: 10px;
          font-weight: 850;
        }

        .sf-grand-total small {
          margin-top: 0.5mm;
          color: #64748b;
          font-size: 7px;
        }

        .sf-grand-total > strong {
          color: #172238;
          font-size: 15px;
          font-weight: 900;
        }

        /* FOOTER */
        .sf-invoice-footer {
          width: 100%;
          margin-top: auto;
          padding-top: 4mm;
          text-align: center;
          flex-shrink: 0;
        }

        .sf-footer-brand {
          color: #172238;
          font-family: Georgia, serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .sf-footer-contact {
          margin-top: 1mm;
          color: #64748b;
          font-size: 7.5px;
        }

        .sf-footer-contact span {
          margin: 0 1.5mm;
          color: #c7a65a;
        }

        .sf-footer-rule {
          width: 20mm;
          height: 1px;
          margin: 2mm auto;
          background: #c7a65a;
        }

        .sf-footer-copy {
          color: #94a3b8;
          font-size: 6.5px;
        }

        /* PRINT STYLES */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            background: #fff !important;
          }

          .sf-invoice-print {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .sf-invoice-page {
            width: 210mm !important;
            height: 297mm !important;
            padding: 14mm 14mm 12mm !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
});

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;