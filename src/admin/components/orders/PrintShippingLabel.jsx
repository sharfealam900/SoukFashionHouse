import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const PrintShippingLabel = forwardRef(({ order }, ref) => {
    if (!order) return null;

    return (
        <div
            ref={ref}
            style={{
                width: "100mm",
                minHeight: "150mm",
                background: "#fff",
                color: "#000",
                fontFamily: "Arial, sans-serif",
                border: "2px solid #000",
                boxSizing: "border-box",
                padding: "12px",
                margin: "0 auto",
            }}
        >
            {/* Header */}
            <div
                style={{
                    textAlign: "center",
                    borderBottom: "2px solid #000",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "700",
                    }}
                >
                    SOUK Fashion House
                </h2>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#555",
                        marginTop: "5px",
                    }}
                >
                    Shipping Label
                </div>
            </div>

            {/* Order Info */}
            <table
                style={{
                    width: "100%",
                    fontSize: "13px",
                    marginBottom: "10px",
                }}
            >
                <tbody>
                    <tr>
                        <td>
                            <strong>Order ID</strong>
                        </td>

                        <td style={{ textAlign: "right" }}>
                            #{order._id.slice(-8).toUpperCase()}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <strong>Date</strong>
                        </td>

                        <td style={{ textAlign: "right" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />

            {/* Customer */}
            <div
                style={{
                    marginBottom: "12px",
                }}
            >
                <div
                    style={{
                        fontWeight: "700",
                        marginBottom: "6px",
                        fontSize: "15px",
                    }}
                >
                    SHIP TO
                </div>

                <div
                    style={{
                        fontWeight: "600",
                        fontSize: "15px",
                    }}
                >
                    {order.shippingAddress.fullName}
                </div>

                <div>{order.shippingAddress.phone}</div>

                <div>{order.shippingAddress.email}</div>

                <div
                    style={{
                        whiteSpace: "pre-wrap",
                        marginTop: "5px",
                    }}
                >
                    {order.shippingAddress.address}
                </div>
            </div>

            <hr />

            {/* Products */}

            <div
                style={{
                    marginBottom: "12px",
                }}
            >
                <div
                    style={{
                        fontWeight: "700",
                        marginBottom: "6px",
                        fontSize: "15px",
                    }}
                >
                    ITEMS
                </div>

                {order.items.map((item) => (
                    <div
                        key={item.product._id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            fontSize: "14px",
                        }}
                    >
                        <span>{item.product.name}</span>

                        <strong>x {item.quantity}</strong>
                    </div>
                ))}
            </div>

            <hr />

            {/* Payment */}

            <table
                style={{
                    width: "100%",
                    fontSize: "14px",
                    marginBottom: "12px",
                }}
            >
                <tbody>
                    <tr>
                        <td>
                            <strong>Payment</strong>
                        </td>

                        <td style={{ textAlign: "right" }}>
                            {order.paymentMethod}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <strong>Status</strong>
                        </td>

                        <td style={{ textAlign: "right" }}>
                            {order.paymentStatus}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <strong>Amount</strong>
                        </td>

                        <td
                            style={{
                                textAlign: "right",
                                fontSize: "16px",
                                fontWeight: "700",
                            }}
                        >
                            ₹{order.finalAmount}
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />

            {/* Barcode */}

            <div
                style={{
                    width: "100%",
                    overflow: "hidden",
                    textAlign: "center",
                    marginTop: "12px",
                }}
            >
                <Barcode
                    value={order._id}
                    width={1}
                    height={45}
                    displayValue={true}
                    fontSize={10}
                    margin={0}
                    marginTop={5}
                    marginBottom={5}
                />

                <div
                    style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "#666",
                    }}
                >
                    Thank you for shopping with
                    <br />
                    <strong>SOUK Fashion House</strong>
                </div>
            </div>
        </div>
    );
});

export default PrintShippingLabel;