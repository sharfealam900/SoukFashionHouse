import React, { forwardRef } from "react";

const PrintInvoice = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "30px",
        background: "#fff",
        color: "#000",
      }}
    >
      {/* Header */}

      <div className="d-flex justify-content-between mb-4">

        <div>

          <h2 className="fw-bold">
            SOUK Fashion House
          </h2>

          <small>
            Delhi, India
          </small>

        </div>

        <div className="text-end">

          <h4>INVOICE</h4>

          <div>
            #{order._id.slice(-8).toUpperCase()}
          </div>

          <small>
            {new Date(order.createdAt).toLocaleDateString()}
          </small>

        </div>

      </div>

      <hr />

      {/* Customer */}

      <div className="row mb-4">

        <div className="col-6">

          <h6>Bill To</h6>

          <strong>
            {order.shippingAddress.fullName}
          </strong>

          <div>{order.shippingAddress.phone}</div>

          <div>{order.shippingAddress.email}</div>

          <div>
            {order.shippingAddress.address}
          </div>

        </div>

        <div className="col-6 text-end">

          <div>
            Payment :
            <strong>
              {order.paymentMethod}
            </strong>
          </div>

          <div>
            Status :
            <strong>
              {order.paymentStatus}
            </strong>
          </div>

        </div>

      </div>

      {/* Products */}

      <table className="table table-bordered">

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

          {order.items.map((item, index) => (

            <tr key={index}>

              <td>{index + 1}</td>

              <td>{item.product.name}</td>

              <td>{item.size || "-"}</td>

              <td>{item.color || "-"}</td>

              <td>{item.quantity}</td>

              <td>₹{item.price}</td>

              <td>
                ₹{item.price * item.quantity}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div
        className="ms-auto"
        style={{ width: 320 }}
      >

        <div className="d-flex justify-content-between">

          <span>Subtotal</span>

          <span>
            ₹{order.totalAmount}
          </span>

        </div>

        <div className="d-flex justify-content-between">

          <span>Discount</span>

          <span>
            -₹{order.discountAmount}
          </span>

        </div>

        <hr />

        <div className="d-flex justify-content-between">

          <h5>Grand Total</h5>

          <h5>
            ₹{order.finalAmount}
          </h5>

        </div>

      </div>

      <hr />

      <div className="text-center mt-5">

        <small>

          Thank you for shopping with
          <br />
          SOUK Fashion House

        </small>

      </div>

    </div>
  );
});

export default PrintInvoice;