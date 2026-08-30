import React, { forwardRef } from "react";

const PrintInvoice = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const invoiceNumber = order?._id
    ? order._id.slice(-8).toUpperCase()
    : "";

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : "";

  const shippingAddress = order?.shippingAddress || {};

  return (
    <div ref={ref} className="invoice-print-wrapper">
      <div className="print-invoice">
        <div className="invoice-header">
          <div className="company-info">
            <h2>SOUK Fashion House</h2>
            <div>Delhi, India</div>
          </div>

          <div className="invoice-info">
            <h3>INVOICE</h3>
            <div>#{invoiceNumber}</div>
            <div>{orderDate}</div>
          </div>
        </div>

        <div className="invoice-line" />

        <div className="customer-payment">
          <div className="customer-info">
            <div className="section-heading">BILL TO</div>

            <strong>
              {shippingAddress.fullName || "-"}
            </strong>

            <div>
              {shippingAddress.phone || "-"}
            </div>

            <div className="break-text">
              {shippingAddress.email || "-"}
            </div>

            <div className="break-text">
              {shippingAddress.address || "-"}
            </div>
          </div>

          <div className="payment-info">
            <div>
              <span>Payment: </span>
              <strong>
                {order.paymentMethod || "-"}
              </strong>
            </div>

            <div>
              <span>Status: </span>
              <strong>
                {order.paymentStatus || "-"}
              </strong>
            </div>
          </div>
        </div>

        <table className="invoice-table">
          <colgroup>
            <col className="col-number" />
            <col className="col-product" />
            <col className="col-size" />
            <col className="col-color" />
            <col className="col-qty" />
            <col className="col-price" />
            <col className="col-total" />
          </colgroup>

          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items?.map((item, index) => {
              const price = Number(item?.price || 0);
              const quantity = Number(item?.quantity || 0);
              const total = price * quantity;

              return (
                <tr key={item?.product?._id || index}>
                  <td>{index + 1}</td>

                  <td className="break-text">
                    {item?.product?.name || "-"}
                  </td>

                  <td>
                    {item?.size || "-"}
                  </td>

                  <td>
                    {item?.color || "-"}
                  </td>

                  <td>
                    {quantity}
                  </td>

                  <td className="money">
                    ₹{price.toFixed(2)}
                  </td>

                  <td className="money">
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div>
            <span>Subtotal</span>
            <span>
              ₹{Number(order.totalAmount || 0).toFixed(2)}
            </span>
          </div>

          <div>
            <span>Discount</span>
            <span>
              -₹{Number(order.discountAmount || 0).toFixed(2)}
            </span>
          </div>

          <div className="grand-total">
            <strong>Grand Total</strong>
            <strong>
              ₹{Number(order.finalAmount || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="invoice-footer">
          <div>Thank you for shopping with</div>
          <strong>SOUK Fashion House</strong>
        </div>
      </div>

      <style>{`
        .invoice-print-wrapper {
          width: 210mm;
          min-height: 297mm;
          margin: 0;
          padding: 0;
          background: #fff;
          color: #000;
        }

        .print-invoice {
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          padding: 15mm;
          margin: 0;
          background: #fff;
          color: #000;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          line-height: 1.4;
          overflow: hidden;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 18px;
        }

        .company-info {
          flex: 1 1 60%;
          min-width: 0;
        }

        .company-info h2 {
          margin: 0 0 5px;
          font-size: 23px;
          font-weight: 700;
          line-height: 1.2;
        }

        .company-info div {
          font-size: 12px;
          color: #333;
        }

        .invoice-info {
          flex: 0 0 35%;
          min-width: 0;
          text-align: right;
        }

        .invoice-info h3 {
          margin: 0 0 7px;
          font-size: 18px;
          font-weight: 700;
        }

        .invoice-info div {
          font-size: 12px;
          margin-bottom: 3px;
        }

        .invoice-info div:last-child {
          color: #444;
        }

        .invoice-line {
          border-top: 1px solid #222;
          margin-bottom: 18px;
        }

        .customer-payment {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 25px;
          margin-bottom: 22px;
        }

        .customer-info {
          width: 55%;
          min-width: 0;
        }

        .section-heading {
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .customer-info strong {
          display: block;
          margin-bottom: 3px;
        }

        .break-text {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .payment-info {
          width: 45%;
          min-width: 0;
          text-align: right;
        }

        .payment-info > div {
          margin-bottom: 7px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 11.5px;
        }

        .invoice-table .col-number {
          width: 6%;
        }

        .invoice-table .col-product {
          width: 32%;
        }

        .invoice-table .col-size {
          width: 11%;
        }

        .invoice-table .col-color {
          width: 13%;
        }

        .invoice-table .col-qty {
          width: 9%;
        }

        .invoice-table .col-price {
          width: 14.5%;
        }

        .invoice-table .col-total {
          width: 14.5%;
        }

        .invoice-table th,
        .invoice-table td {
          border: 1px solid #ccc;
          padding: 8px 6px;
          box-sizing: border-box;
          vertical-align: top;
        }

        .invoice-table th {
          background: #f5f5f5;
          font-weight: 700;
          text-align: left;
        }

        .invoice-table th:nth-child(3),
        .invoice-table th:nth-child(4),
        .invoice-table th:nth-child(5),
        .invoice-table td:nth-child(3),
        .invoice-table td:nth-child(4),
        .invoice-table td:nth-child(5) {
          text-align: center;
        }

        .invoice-table th:nth-child(6),
        .invoice-table th:nth-child(7),
        .invoice-table td:nth-child(6),
        .invoice-table td:nth-child(7) {
          text-align: right;
        }

        .money {
          white-space: nowrap;
        }

        .invoice-totals {
          width: 290px;
          max-width: 100%;
          margin-left: auto;
          margin-top: 20px;
        }

        .invoice-totals > div {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }

        .invoice-totals .grand-total {
          border-top: 1px solid #ccc;
          margin-top: 8px;
          padding-top: 10px;
          font-size: 15px;
          font-weight: 700;
        }

        .invoice-footer {
          border-top: 1px solid #ccc;
          margin-top: 35px;
          padding-top: 18px;
          text-align: center;
          font-size: 11px;
          color: #444;
        }

        .invoice-footer strong {
          color: #000;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden;
          }

          .invoice-print-wrapper,
          .invoice-print-wrapper * {
            visibility: visible;
          }

          .invoice-print-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-invoice {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          .invoice-table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .invoice-table th,
          .invoice-table td {
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
});

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;