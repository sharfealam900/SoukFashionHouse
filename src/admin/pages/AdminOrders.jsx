import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Form, Spinner, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  exportOrdersExcel,
  getAllOrders,
  updateOrderStatus,
} from "../../features/order/orderApi";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../components/orders/PrintInvoice";
import PrintShippingLabel from "../components/orders/PrintShippingLabel";
import exportOrdersPdf from "../utils/exportOrdersPdf";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [printType, setPrintType] = useState(null);

  const printRef = useRef(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // One print hook + one ref. The selected print type controls
  // both the document title and the physical paper size.
  const pageStyle =
    printType === "label"
      ? `
        @page {
          size: 100mm 150mm;
          margin: 0 !important;
        }

        html, body {
          width: 100mm !important;
          height: 150mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `
      : `
        @page {
          size: A4 portrait;
          margin: 0 !important;
        }

        html, body {
          width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle:
      printType === "label"
        ? "SOUK Fashion House Shipping Label"
        : "SOUK Fashion House Invoice",
    pageStyle,
    onAfterPrint: () => {
      setPrintType(null);
    },
  });

  const startPrint = (order, type) => {
    setSelectedOrder(order);
    setPrintType(type);
  };

  useEffect(() => {
    if (!selectedOrder || !printType) return;

    const timer = setTimeout(() => {
      if (printRef.current) {
        handlePrint();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedOrder, printType, handlePrint]);

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
      const orderDate = new Date(order.createdAt);

      const matchesSearch =
        order._id?.toLowerCase().includes(keyword) ||
        order.user?.name?.toLowerCase().includes(keyword) ||
        order.user?.email?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        order.paymentStatus === paymentFilter;

      const matchesFrom =
        !fromDate ||
        orderDate >= new Date(fromDate);

      const matchesTo =
        !toDate ||
        orderDate <= new Date(`${toDate}T23:59:59`);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    fromDate,
    toDate,
  ]);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
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

  const downloadPdf = () => {
    exportOrdersPdf(filteredOrders);
  };

  const downloadExcel = async () => {
    try {
      const response = await exportOrdersExcel();

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = "Orders.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Unable to export.");
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

      case "Out for Delivery":
        return "primary";

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

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <h2 className="fw-bold mb-0">
          Orders
        </h2>

        <div className="d-flex flex-wrap gap-2 align-items-center">

          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
            style={{ width: 170 }}
          />

          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
            style={{ width: 170 }}
          />

          <Form.Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={{ width: 170 }}
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Packed">
              Packed
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Out for Delivery">
              Out for Delivery
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </Form.Select>

          <Form.Select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value)
            }
            style={{ width: 170 }}
          >
            <option value="All">
              All Payment
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>
          </Form.Select>

          <Form.Control
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{ width: 250 }}
          />

          <button
            className="btn btn-success"
            onClick={downloadExcel}
          >
            Excel
          </button>

          <button
            className="btn btn-danger"
            onClick={downloadPdf}
          >
            PDF
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
              setStatusFilter("All");
              setPaymentFilter("All");
            }}
          >
            Reset
          </button>

        </div>
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
                  {order._id
                    ?.slice(-8)
                    .toUpperCase()}
                </td>

                <td>
                  <div>
                    <strong>
                      {order.user?.name}
                    </strong>

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
                          ₹
                          {order.finalAmount?.toLocaleString(
                            "en-IN"
                          )}
                        </div>

                        <small className="text-muted text-decoration-line-through">
                          ₹
                          {order.totalAmount?.toLocaleString(
                            "en-IN"
                          )}
                        </small>
                      </>

                    ) : (

                      <span className="fw-bold">
                        ₹
                        {order.totalAmount?.toLocaleString(
                          "en-IN"
                        )}
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

                    <span className="text-muted">
                      —
                    </span>

                  )}
                </td>

                <td>
                  <Badge bg="dark">
                    {order.paymentMethod}
                  </Badge>
                </td>

                <td>
                  <Badge
                    bg={getPaymentBadge(
                      order.paymentStatus
                    )}
                  >
                    {order.paymentStatus}
                  </Badge>
                </td>

                <td>
                  <Badge
                    bg={getStatusBadge(
                      order.orderStatus
                    )}
                  >
                    {order.orderStatus}
                  </Badge>
                </td>

                <td className="text-center">
                  {order.items?.length || 0}
                </td>

                <td>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN")}
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
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Packed">
                      Packed
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </Form.Select>

                </td>

                <td>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() =>
                        startPrint(
                          order,
                          "invoice"
                        )
                      }
                    >
                      Invoice
                    </button>

                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() =>
                        startPrint(
                          order,
                          "label"
                        )
                      }
                    >
                      Label
                    </button>

                  </div>

                </td>

              </tr>

            ))
          )}

        </tbody>
      </Table>

      {showModal && selectedOrder && (

        <div
          className="modal fade show d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
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
                      <Badge
                        bg={getPaymentBadge(
                          selectedOrder.paymentStatus
                        )}
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </p>

                    <p className="mb-1">
                      <strong>Order Status:</strong>{" "}
                      <Badge
                        bg={getStatusBadge(
                          selectedOrder.orderStatus
                        )}
                      >
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
                      style={{
                        whiteSpace: "pre-line",
                      }}
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

                {selectedOrder.items?.map(
                  (item, index) => (

                    <div
                      key={item._id || index}
                      className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
                    >

                      <div>

                        <h6 className="mb-1">
                          {item.product?.name}
                        </h6>

                        <small className="text-muted">
                          Quantity :{" "}
                          {item.quantity}
                        </small>

                      </div>

                      <div className="fw-bold">
                        ₹{item.price}
                      </div>

                    </div>

                  )
                )}

                <hr />

                <div className="border rounded p-3">

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {selectedOrder.totalAmount?.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Coupon
                    </span>

                    <span className="text-success">
                      {selectedOrder.couponCode ||
                        "No Coupon"}
                    </span>

                  </div>

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Discount
                    </span>

                    <span className="text-danger">
                      -₹
                      {selectedOrder.discountAmount?.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <h5>
                      Final Paid
                    </h5>

                    <h5 className="fw-bold text-success">
                      ₹
                      {selectedOrder.finalAmount?.toLocaleString(
                        "en-IN"
                      )}
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

      {selectedOrder && printType && (
        <div className="print-container">
          {printType === "invoice" ? (
            <PrintInvoice
              ref={printRef}
              order={selectedOrder}
            />
          ) : (
            <PrintShippingLabel
              ref={printRef}
              order={selectedOrder}
            />
          )}
        </div>
      )}

    </div>
  );
}