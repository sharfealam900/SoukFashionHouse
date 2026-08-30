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
            <div className="sf-section-label">BILL TO</div>

            <div className="sf-customer-name">{customerName}</div>

            <div className="sf-contact-line">{customerPhone}</div>
            <div className="sf-contact-line sf-wrap">{customerEmail}</div>

            <div className="sf-address">
              <span className="sf-address-label">Shipping Address</span>
              <span className="sf-wrap">{customerAddress}</span>
            </div>
          </div>

          <div className="sf-info-card sf-payment-card">
            <div className="sf-section-label">PAYMENT DETAILS</div>

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
              <div className="sf-section-label">ORDER SUMMARY</div>

              <div className="sf-table-title">Items Purchased</div>
            </div>

            <div className="sf-item-count">
              {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
              {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
            </div>
          </div>

          <div className="sf-table-wrap">
            <table className="sf-invoice-table">
              <colgroup>
                <col className="sf-col-no" />
                <col className="sf-col-product" />
                <col className="sf-col-size" />
                <col className="sf-col-color" />
                <col className="sf-col-qty" />
                <col className="sf-col-price" />
                <col className="sf-col-total" />
              </colgroup>

              <thead>
                <tr>
                  <th className="sf-center">#</th>
                  <th>Product</th>
                  <th className="sf-center">Size</th>
                  <th className="sf-center">Color</th>
                  <th className="sf-center">Qty</th>
                  <th className="sf-money">Rate</th>
                  <th className="sf-money">Amount</th>
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const price = Number(item?.price || 0);
                    const quantity = Number(item?.quantity || 0);
                    const itemTotal = price * quantity;

                    return (
                      <tr key={item?.product?._id || item?._id || index}>
                        <td className="sf-center sf-row-number">
                          {index + 1}
                        </td>

                        <td className="sf-product-cell">
                          <div className="sf-product-name">
                            {item?.product?.name || item?.name || "-"}
                          </div>
                        </td>

                        <td className="sf-center">{item?.size || "-"}</td>
                        <td className="sf-center">{item?.color || "-"}</td>
                        <td className="sf-center">{quantity}</td>

                        <td className="sf-money">{formatCurrency(price)}</td>

                        <td className="sf-money sf-line-total">
                          {formatCurrency(itemTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="sf-empty-row">
                      No items found in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= TOTALS ================= */}
        <section className="sf-summary-section">
          <div className="sf-summary-note">
            <div className="sf-note-title">
              Thank you for shopping with SOUK.
            </div>

            <div className="sf-note-text">
              We appreciate your order and hope you enjoy your purchase.
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
                <small>Inclusive of applicable charges</small>
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
            This is a computer-generated invoice and does not require a
            signature.
          </div>
        </footer>
      </div>

      <style>{`
        /* ==========================================================
           SOUK — PREMIUM A4 INVOICE
           Designed specifically to prevent price/amount cropping.
        ========================================================== */

        .sf-invoice-print,
        .sf-invoice-print * {
          box-sizing: border-box;
        }

        .sf-invoice-print {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          background: #fff;
          color: #18212f;
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

        .sf-invoice-page {
          width: 210mm;
          height: 297mm;
          padding: 12mm 13mm 9mm;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
          font-size: 10px;
          line-height: 1.4;
        }

        /* ================= HEADER ================= */

        .sf-invoice-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10mm;
          padding-bottom: 6mm;
          border-bottom: 1.5px solid #172238;
          flex-shrink: 0;
        }

        .sf-brand-block {
          display: flex;
          align-items: center;
          gap: 3.5mm;
          min-width: 0;
        }

        .sf-brand-mark {
          width: 12mm;
          height: 12mm;
          flex: 0 0 12mm;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.4px solid #c7a65a;
          border-radius: 50%;
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 700;
        }

        .sf-brand-name {
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          line-height: 0.95;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .sf-brand-subtitle {
          margin-top: 1.6mm;
          color: #8d7440;
          font-size: 6.5px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 2.2px;
        }

        .sf-brand-location {
          margin-top: 1.8mm;
          color: #7b8492;
          font-size: 8px;
        }

        .sf-invoice-meta {
          min-width: 58mm;
          text-align: right;
          flex-shrink: 0;
        }

        .sf-invoice-kicker {
          color: #8d7440;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .sf-invoice-number {
          margin-top: 0.8mm;
          color: #172238;
          font-size: 16px;
          line-height: 1.05;
          font-weight: 850;
          letter-spacing: 0.4px;
          white-space: nowrap;
        }

        .sf-meta-grid {
          margin-top: 3mm;
          display: grid;
          grid-template-columns: auto auto;
          gap: 6mm;
        }

        .sf-meta-grid div {
          display: flex;
          flex-direction: column;
          gap: 0.7mm;
        }

        .sf-meta-grid span {
          color: #89919d;
          font-size: 6.5px;
          text-transform: uppercase;
          letter-spacing: 0.55px;
        }

        .sf-meta-grid strong {
          color: #263247;
          font-size: 8px;
          font-weight: 750;
          white-space: nowrap;
        }

        /* ================= INFO ================= */

        .sf-info-grid {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(0, 0.75fr);
          gap: 4mm;
          margin-top: 5.5mm;
          margin-bottom: 5.5mm;
          flex-shrink: 0;
        }

        .sf-info-card {
          min-width: 0;
          min-height: 36mm;
          padding: 4.2mm 4.5mm;
          border: 1px solid #dfe3e7;
          border-radius: 2px;
          background: #fbfbfa;
        }

        .sf-customer-card {
          border-left: 3px solid #c7a65a;
        }

        .sf-section-label {
          color: #8b7444;
          font-size: 6.7px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: 1.35px;
          text-transform: uppercase;
        }

        .sf-customer-name {
          margin-top: 3mm;
          margin-bottom: 1.4mm;
          color: #172238;
          font-size: 12px;
          line-height: 1.1;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .sf-contact-line {
          color: #596474;
          font-size: 8px;
          line-height: 1.45;
        }

        .sf-wrap {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-address {
          margin-top: 2.8mm;
          padding-top: 2.5mm;
          border-top: 1px solid #e5e8ec;
          display: flex;
          flex-direction: column;
          gap: 0.8mm;
          color: #4e5969;
          font-size: 8px;
          line-height: 1.4;
        }

        .sf-address-label {
          color: #8b94a0;
          font-size: 6.4px;
          font-weight: 700;
          letter-spacing: 0.65px;
          text-transform: uppercase;
        }

        .sf-payment-card {
          display: flex;
          flex-direction: column;
        }

        .sf-payment-detail {
          min-width: 0;
          min-height: 8.5mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3mm;
          border-bottom: 1px solid #e5e8ec;
        }

        .sf-payment-detail:first-of-type {
          margin-top: 1.5mm;
        }

        .sf-payment-detail > span:first-child {
          color: #7c8592;
          font-size: 7.5px;
          flex-shrink: 0;
        }

        .sf-payment-detail strong {
          min-width: 0;
          color: #263247;
          font-size: 8px;
          font-weight: 800;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .sf-payment-last {
          border-bottom: 0;
        }

        .sf-status-badge {
          padding: 1mm 1.8mm;
          border-radius: 20px;
          background: #edf0f3;
          color: #4a5565;
          font-size: 6px !important;
          line-height: 1;
          font-weight: 800 !important;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sf-status-paid,
        .sf-status-completed,
        .sf-status-success {
          background: #e6f4ed;
          color: #16734b;
        }

        .sf-status-pending {
          background: #fff3d7;
          color: #936b18;
        }

        .sf-status-failed,
        .sf-status-cancelled,
        .sf-status-canceled {
          background: #fbe8e8;
          color: #a63e3e;
        }

        /* ================= TABLE ================= */

        .sf-items-section {
          width: 100%;
          min-width: 0;
          flex-shrink: 0;
          margin-bottom: 5mm;
        }

        .sf-table-heading {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 5mm;
          margin-bottom: 2.3mm;
        }

        .sf-table-title {
          margin-top: 1.2mm;
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 12px;
          font-weight: 700;
        }

        .sf-item-count {
          color: #89919d;
          font-size: 7px;
          font-weight: 600;
          padding-bottom: 0.5mm;
          white-space: nowrap;
        }

        .sf-table-wrap {
          width: 100%;
          max-width: 100%;
          overflow: visible;
        }

        .sf-invoice-table {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
          font-size: 7.8px;
        }

        /*
          TOTAL = 100%.
          Price/Amount get dedicated space so values such as
          ₹23,400.00 never get clipped.
        */
        .sf-col-no {
          width: 5%;
        }

        .sf-col-product {
          width: 39%;
        }

        .sf-col-size {
          width: 8%;
        }

        .sf-col-color {
          width: 10%;
        }

        .sf-col-qty {
          width: 8%;
        }

        .sf-col-price {
          width: 15%;
        }

        .sf-col-total {
          width: 15%;
        }

        .sf-invoice-table th,
        .sf-invoice-table td {
          min-width: 0;
          vertical-align: middle;
          box-sizing: border-box;
        }

        .sf-invoice-table th {
          height: 9mm;
          padding: 2.2mm 1.6mm;
          background: #172238;
          color: #fff;
          font-size: 6.2px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.45px;
          text-transform: uppercase;
          white-space: nowrap;
          border: 0;
        }

        .sf-invoice-table th:first-child {
          border-radius: 2px 0 0 2px;
        }

        .sf-invoice-table th:last-child {
          border-radius: 0 2px 2px 0;
        }

        .sf-invoice-table td {
          padding: 3mm 1.6mm;
          color: #3f4a5b;
          line-height: 1.25;
          border-bottom: 1px solid #e8ebee;
        }

        .sf-invoice-table tbody tr:last-child td {
          border-bottom: 1.5px solid #cfd4da;
        }

        .sf-center {
          text-align: center;
        }

        .sf-money {
          text-align: right;
          white-space: nowrap !important;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          font-size: 7.25px;
          letter-spacing: -0.1px;
          padding-left: 0.9mm !important;
          padding-right: 1.2mm !important;
        }

        .sf-product-cell {
          text-align: left;
          padding-left: 2mm !important;
        }

        .sf-product-name {
          color: #172238;
          font-size: 8.4px;
          line-height: 1.25;
          font-weight: 700;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .sf-row-number {
          color: #9aa2ad !important;
          font-size: 7px;
        }

        .sf-line-total {
          color: #172238 !important;
          font-weight: 850;
        }

        .sf-empty-row {
          text-align: center;
          color: #7a8492;
          padding: 6mm !important;
        }

        /* ================= TOTALS ================= */

        .sf-summary-section {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 70mm;
          gap: 8mm;
          align-items: start;
          flex-shrink: 0;
        }

        .sf-summary-note {
          padding-top: 1mm;
          min-width: 0;
        }

        .sf-note-title {
          color: #263247;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 10px;
          font-weight: 700;
        }

        .sf-note-text {
          max-width: 70mm;
          margin-top: 1.2mm;
          color: #89919d;
          font-size: 7.4px;
          line-height: 1.5;
        }

        .sf-totals-box {
          width: 70mm;
          min-width: 0;
          padding: 4mm 4.5mm;
          border: 1px solid #dfe3e7;
          border-radius: 2px;
          background: #fbfbfa;
        }

        .sf-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4mm;
          padding: 1.2mm 0;
          color: #687281;
          font-size: 8px;
        }

        .sf-total-row strong {
          color: #344052;
          font-weight: 700;
          white-space: nowrap;
        }

        .sf-discount-row,
        .sf-discount-row strong {
          color: #21815a;
        }

        .sf-total-divider {
          height: 1px;
          margin: 2mm 0 1.4mm;
          background: #d8dde2;
        }

        .sf-grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4mm;
          padding-top: 1.2mm;
        }

        .sf-grand-total > div {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sf-grand-total span {
          color: #172238;
          font-size: 8.7px;
          font-weight: 800;
        }

        .sf-grand-total small {
          margin-top: 0.7mm;
          color: #8b94a0;
          font-size: 5.9px;
          font-weight: 500;
          white-space: nowrap;
        }

        .sf-grand-total > strong {
          color: #172238;
          font-size: 13.5px;
          line-height: 1;
          font-weight: 900;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ================= FOOTER ================= */

        .sf-invoice-footer {
          width: 100%;
          margin-top: auto;
          padding-top: 4mm;
          text-align: center;
          flex-shrink: 0;
        }

        .sf-footer-brand {
          color: #172238;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 1.3px;
        }

        .sf-footer-contact {
          margin-top: 1mm;
          color: #7f8996;
          font-size: 6.7px;
        }

        .sf-footer-contact span {
          margin: 0 1.3mm;
          color: #c7a65a;
        }

        .sf-footer-rule {
          width: 16mm;
          height: 1px;
          margin: 2mm auto 1.7mm;
          background: #c7a65a;
        }

        .sf-footer-copy {
          color: #a0a7b0;
          font-size: 5.9px;
        }

        /* ================= PRINT ================= */

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
            min-width: 210mm !important;
            background: #fff !important;
          }

          .sf-invoice-print {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            display: block !important;
            background: #fff !important;
          }

          .sf-invoice-page {
            width: 210mm !important;
            height: 297mm !important;
            padding: 12mm 13mm 9mm !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .sf-invoice-header,
          .sf-info-grid,
          .sf-items-section,
          .sf-summary-section,
          .sf-invoice-footer {
            width: 100% !important;
            max-width: 100% !important;
          }

          .sf-table-wrap,
          .sf-invoice-table {
            width: 100% !important;
            max-width: 100% !important;
          }

          .sf-invoice-table {
            table-layout: fixed !important;
            break-inside: avoid !important;
          }

          .sf-invoice-table th,
          .sf-invoice-table td {
            overflow: visible !important;
          }

          .sf-info-grid,
          .sf-summary-section,
          .sf-totals-box {
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
});

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;
