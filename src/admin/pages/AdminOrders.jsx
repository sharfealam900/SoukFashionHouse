import React, { useEffect, useMemo, useState } from "react";
import { Badge, Form, Spinner, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../features/order/orderApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await getAllOrders();

      setOrders(data.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase();

    return orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(keyword) ||
        order.user?.name?.toLowerCase().includes(keyword) ||
        order.user?.email?.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);

      toast.success("Order updated");

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to update order"
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "warning";

      case "Confirmed":
        return "primary";

      case "Packed":
        return "info";

      case "Shipped":
        return "secondary";

      case "Delivered":
        return "success";

      case "Cancelled":
        return "danger";

      default:
        return "dark";
    }
  };

  const getPaymentBadge = (status) => {
    return status === "Paid"
      ? "success"
      : "warning";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">Orders</h2>

        <Form.Control
          style={{ maxWidth: "320px" }}
          placeholder="Search by Order ID, Name or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <Table
        bordered
        hover
        responsive
        className="align-middle"
      >

        <thead className="table-dark">

          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Coupon</th>
            <th>Payment</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Items</th>
            <th>Date</th>
            <th style={{ width: "180px" }}>
              Change Status
            </th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {filteredOrders.length === 0 ? (

            <tr>

              <td
                colSpan="11"
                className="text-center py-5"
              >
                No orders found.
              </td>

            </tr>

          ) : (

            filteredOrders.map((order) => (

              <tr key={order._id}>
                <td>
                  {order._id.slice(-8).toUpperCase()}
                </td>

                <td>
                  <div>
                    <strong>{order.user?.name}</strong>

                    <br />

                    <small className="text-muted">
                      {order.user?.email}
                    </small>
                  </div>
                </td>

                <td>
                  <div>
                    {order.discountAmount > 0 ? (
                      <>
                        <div className="fw-bold text-success">
                          ₹{order.finalAmount?.toLocaleString("en-IN")}
                        </div>

                        <small className="text-muted text-decoration-line-through">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </small>
                      </>
                    ) : (
                      <span className="fw-bold">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  {order.couponCode ? (
                    <Badge bg="success">
                      {order.couponCode}
                    </Badge>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>

                <td>
                  <Badge bg="dark">
                    {order.paymentMethod}
                  </Badge>
                </td>

                <td>
                  <Badge bg={getPaymentBadge(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </td>

                <td>
                  <Badge bg={getStatusBadge(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </td>

                <td className="text-center">
                  {order.items?.length || 0}
                </td>

                <td>
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td>
                  <Form.Select
                    size="sm"
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </td>

                <td>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    View
                  </button>
                </td>

              </tr>

            ))
          )}

        </tbody>

      </Table>
      {showModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Order Details
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                />
              </div>

              <div className="modal-body">

                <div className="row g-4">

                  <div className="col-md-6">

                    <h6 className="fw-bold">
                      Customer Information
                    </h6>

                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {selectedOrder.user?.name}
                    </p>

                    <p className="mb-1">
                      <strong>Email:</strong>{" "}
                      {selectedOrder.user?.email}
                    </p>

                    <p className="mb-1">
                      <strong>Payment:</strong>{" "}
                      {selectedOrder.paymentMethod}
                    </p>

                    <p className="mb-1">
                      <strong>Payment Status:</strong>{" "}
                      <Badge bg={getPaymentBadge(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </p>

                    <p className="mb-1">
                      <strong>Order Status:</strong>{" "}
                      <Badge bg={getStatusBadge(selectedOrder.orderStatus)}>
                        {selectedOrder.orderStatus}
                      </Badge>
                    </p>

                  </div>

                  <div className="col-md-6">

                    <h6 className="fw-bold mb-3">
                      Shipping Address
                    </h6>

                    <p className="mb-2">
                      <strong>Name:</strong>{" "}
                      {selectedOrder.shippingAddress?.fullName}
                    </p>

                    <p className="mb-2">
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.shippingAddress?.phone}
                    </p>

                    <p className="mb-2">
                      <strong>Email:</strong>{" "}
                      {selectedOrder.shippingAddress?.email}
                    </p>

                    <p
                      className="mb-0"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      <strong>Address:</strong>
                      <br />
                      {selectedOrder.shippingAddress?.address}
                    </p>
                  </div>

                </div>

                <hr />

                <h5 className="mb-3">
                  Ordered Products
                </h5>

                {selectedOrder.items?.map((item) => (

                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
                  >

                    <div>

                      <h6 className="mb-1">
                        {item.product?.name}
                      </h6>

                      <small className="text-muted">
                        Quantity :
                        {" "}
                        {item.quantity}
                      </small>

                    </div>

                    <div className="fw-bold">
                      ₹{item.price}
                    </div>

                  </div>

                ))}

                <hr />
                <div className="border rounded p-3">

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>

                    <span>
                      ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Coupon</span>

                    <span className="text-success">
                      {selectedOrder.couponCode || "No Coupon"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Discount</span>

                    <span className="text-danger">
                      -₹{selectedOrder.discountAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <h5>Final Paid</h5>

                    <h5 className="fw-bold text-success">
                      ₹{selectedOrder.finalAmount?.toLocaleString("en-IN")}
                    </h5>

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}