import React, { forwardRef } from "react";

const PrintInvoice = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const invoiceNumber = order._id
    ? order._id.slice(-8).toUpperCase()
    : "";

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : "";

  return (
    <div
      ref={ref}
      className="print-invoice"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        padding: "15mm",
        margin: "0",
        background: "#ffffff",
        color: "#000000",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        fontSize: "13px",
        lineHeight: "1.4",
        overflow: "hidden",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "18px",
        }}
      >
        {/* Company */}

        <div
          style={{
            flex: "1 1 60%",
            minWidth: 0,
          }}
        >
          <h2
            style={{
              margin: "0 0 5px 0",
              fontSize: "23px",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            SOUK Fashion House
          </h2>

          <div
            style={{
              fontSize: "12px",
              color: "#333",
            }}
          >
            Delhi, India
          </div>
        </div>

        {/* Invoice information */}

        <div
          style={{
            flex: "0 0 35%",
            textAlign: "right",
            minWidth: 0,
          }}
        >
          <h3
            style={{
              margin: "0 0 7px 0",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            INVOICE
          </h3>

          <div
            style={{
              fontSize: "12px",
              marginBottom: "3px",
            }}
          >
            #{invoiceNumber}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#444",
            }}
          >
            {orderDate}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #222",
          marginBottom: "18px",
        }}
      />

      {/* ================= CUSTOMER + PAYMENT ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "25px",
          marginBottom: "22px",
        }}
      >
        {/* Customer */}

        <div
          style={{
            width: "55%",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "7px",
              textTransform: "uppercase",
            }}
          >
            Bill To
          </div>

          <div
            style={{
              fontWeight: "700",
              marginBottom: "3px",
            }}
          >
            {order.shippingAddress?.fullName}
          </div>

          <div>
            {order.shippingAddress?.phone}
          </div>

          <div
            style={{
              overflowWrap: "anywhere",
            }}
          >
            {order.shippingAddress?.email}
          </div>

          <div
            style={{
              marginTop: "3px",
              overflowWrap: "anywhere",
            }}
          >
            {order.shippingAddress?.address}
          </div>
        </div>

        {/* Payment */}

        <div
          style={{
            width: "45%",
            textAlign: "right",
            minWidth: 0,
          }}
        >
          <div style={{ marginBottom: "7px" }}>
            <span>Payment: </span>

            <strong>
              {order.paymentMethod}
            </strong>
          </div>

          <div>
            <span>Status: </span>

            <strong>
              {order.paymentStatus}
            </strong>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}

      <div
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontSize: "11.5px",
          }}
        >
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "14.5%" }} />
            <col style={{ width: "14.5%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "left",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                #
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "left",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Product
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "center",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Size
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "center",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Color
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "center",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Qty
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "right",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Price
              </th>

              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 6px",
                  textAlign: "right",
                  background: "#f5f5f5",
                  fontWeight: "700",
                }}
              >
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    verticalAlign: "top",
                  }}
                >
                  {index + 1}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    verticalAlign: "top",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {item.product?.name || "-"}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    textAlign: "center",
                    verticalAlign: "top",
                  }}
                >
                  {item.size || "-"}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    textAlign: "center",
                    verticalAlign: "top",
                  }}
                >
                  {item.color || "-"}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    textAlign: "center",
                    verticalAlign: "top",
                  }}
                >
                  {item.quantity}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    textAlign: "right",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹{Number(item.price || 0).toFixed(2)}
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px 6px",
                    textAlign: "right",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= TOTALS ================= */}

      <div
        style={{
          width: "290px",
          maxWidth: "100%",
          marginLeft: "auto",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0",
          }}
        >
          <span>Subtotal</span>

          <span>
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0",
          }}
        >
          <span>Discount</span>

          <span>
            -₹
            {Number(
              order.discountAmount || 0
            ).toFixed(2)}
          </span>
        </div>

        <div
          style={{
            borderTop: "1px solid #ccc",
            margin: "8px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "15px",
          }}
        >
          <span>Grand Total</span>

          <span>
            ₹{Number(order.finalAmount || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* ================= FOOTER ================= */}

      <div
        style={{
          borderTop: "1px solid #ccc",
          marginTop: "35px",
          paddingTop: "18px",
          textAlign: "center",
          fontSize: "11px",
          color: "#444",
        }}
      >
        Thank you for shopping with
        <br />
        <strong>SOUK Fashion House</strong>
      </div>

      {/* ================= PRINT FIX ================= */}

      <style>
        {`
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
              background: #ffffff !important;
            }

            .print-invoice {
              width: 210mm !important;
              min-height: 297mm !important;
              max-width: 210mm !important;
              box-sizing: border-box !important;
              margin: 0 !important;
              padding: 15mm !important;
              overflow: hidden !important;
            }

            .print-invoice table {
              width: 100% !important;
              max-width: 100% !important;
              table-layout: fixed !important;
            }

            .print-invoice th,
            .print-invoice td {
              box-sizing: border-box !important;
            }
          }
        `}
      </style>
    </div>
  );
});

export default PrintInvoice;