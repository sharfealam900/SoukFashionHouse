import React from "react";

export default function InvoiceModal({ order }) {
  if (!order) return null;

  return (
    <div id="invoice">

      <div className="text-center mb-4">
        <h2>SOUK Fashion House</h2>
        <p>Invoice</p>
      </div>

      <hr />

      <div className="row">

        <div className="col-md-6">

          <h5>Customer</h5>

          <p>{order.shippingAddress.fullName}</p>

          <p>{order.shippingAddress.phone}</p>

          <p>{order.shippingAddress.email}</p>

          <p>{order.shippingAddress.address}</p>

        </div>

        <div className="col-md-6 text-end">

          <h5>
            Order #
            {order._id.slice(-8).toUpperCase()}
          </h5>

          <p>
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

        </div>

      </div>

      <table className="table mt-4">

        <thead>

          <tr>

            <th>Product</th>

            <th>Qty</th>

            <th>Price</th>

            <th>Total</th>

          </tr>

        </thead>

        <tbody>

          {order.items.map((item) => (

            <tr key={item.product._id}>

              <td>{item.product.name}</td>

              <td>{item.quantity}</td>

              <td>₹{item.price}</td>

              <td>
                ₹{item.price * item.quantity}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="text-end">

        <h5>
          Grand Total :
          ₹{order.finalAmount}
        </h5>

      </div>

    </div>
  );
}