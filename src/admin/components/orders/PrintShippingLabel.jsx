import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const PrintShippingLabel = forwardRef(({ order }, ref) => {
    if (!order) return null;

    const orderId = order?._id?.slice(-8).toUpperCase();

    return (
        <div
            ref={ref}
            style={{
                width: "100mm",
                minHeight: "150mm",
                background: "#fff",
                color: "#111",
                fontFamily:
                    "Arial, Helvetica, sans-serif",
                boxSizing: "border-box",
                border: "1.5px solid #111",
                padding: "7mm",
                margin: "0 auto",
                lineHeight: "1.25",
            }}
        >
            {/* ================= HEADER ================= */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #111",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: "19px",
                            fontWeight: "800",
                            letterSpacing: "0.3px",
                        }}
                    >
                        SOUK
                    </div>

                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            letterSpacing: "0.8px",
                            marginTop: "1px",
                        }}
                    >
                        FASHION HOUSE
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                        }}
                    >
                        SHIPPING LABEL
                    </div>

                    <div
                        style={{
                            fontSize: "9px",
                            color: "#666",
                            marginTop: "3px",
                        }}
                    >
                        E-COMMERCE ORDER
                    </div>
                </div>
            </div>

            {/* ================= ORDER / AWB ================= */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "9px 0",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: "9px",
                            color: "#666",
                            fontWeight: "700",
                            textTransform: "uppercase",
                        }}
                    >
                        Order ID
                    </div>

                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "800",
                            marginTop: "2px",
                        }}
                    >
                        #{orderId}
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <div
                        style={{
                            fontSize: "9px",
                            color: "#666",
                            fontWeight: "700",
                            textTransform: "uppercase",
                        }}
                    >
                        Order Date
                    </div>

                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            marginTop: "2px",
                        }}
                    >
                        {new Date(order.createdAt).toLocaleDateString(
                            "en-IN"
                        )}
                    </div>
                </div>
            </div>

            {/* ================= PAYMENT BADGE ================= */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <div
                    style={{
                        fontSize: "9px",
                        color: "#666",
                        fontWeight: "700",
                    }}
                >
                    PAYMENT METHOD
                </div>

                <div
                    style={{
                        display: "inline-block",
                        border: "1px solid #111",
                        padding: "4px 9px",
                        fontSize: "10px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                    }}
                >
                    {order.paymentMethod}
                </div>
            </div>

            {/* ================= SHIP TO ================= */}
            <div
                style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <div
                    style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        letterSpacing: "0.7px",
                        marginBottom: "7px",
                    }}
                >
                    SHIP TO
                </div>

                <div
                    style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        marginBottom: "4px",
                    }}
                >
                    {order.shippingAddress.fullName}
                </div>

                <div
                    style={{
                        fontSize: "11px",
                        marginBottom: "2px",
                    }}
                >
                    📞 {order.shippingAddress.phone}
                </div>

                <div
                    style={{
                        fontSize: "11px",
                        marginBottom: "5px",
                    }}
                >
                    ✉ {order.shippingAddress.email}
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "1.45",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {order.shippingAddress.address}
                </div>
            </div>

            {/* ================= ITEMS ================= */}
            <div
                style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <div
                    style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        letterSpacing: "0.7px",
                        marginBottom: "7px",
                    }}
                >
                    ORDER ITEMS
                </div>

                {order.items.map((item, index) => (
                    <div
                        key={item.product?._id || index}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "10px",
                            marginBottom:
                                index !== order.items.length - 1
                                    ? "7px"
                                    : "0",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                flex: 1,
                            }}
                        >
                            {item.product?.name}

                            {/* Size if available */}
                            {item.size && (
                                <div
                                    style={{
                                        fontSize: "9px",
                                        color: "#666",
                                        marginTop: "2px",
                                    }}
                                >
                                    Size: {item.size}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                whiteSpace: "nowrap",
                            }}
                        >
                            × {item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div
                style={{
                    padding: "10px 0",
                    borderBottom: "2px solid #111",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                        fontSize: "10px",
                    }}
                >
                    <span>Payment Status</span>

                    <strong
                        style={{
                            textTransform: "uppercase",
                        }}
                    >
                        {order.paymentStatus}
                    </strong>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "7px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: "700",
                        }}
                    >
                        TOTAL AMOUNT
                    </span>

                    <span
                        style={{
                            fontSize: "18px",
                            fontWeight: "800",
                        }}
                    >
                        ₹{Number(order.finalAmount || 0).toLocaleString(
                            "en-IN"
                        )}
                    </span>
                </div>
            </div>

            {/* ================= BARCODE ================= */}
            <div
                style={{
                    textAlign: "center",
                    paddingTop: "10px",
                }}
            >
                <Barcode
                    value={order._id}
                    width={1.25}
                    height={42}
                    displayValue={true}
                    fontSize={9}
                    margin={0}
                    marginTop={0}
                    marginBottom={0}
                />

                <div
                    style={{
                        fontSize: "8px",
                        color: "#666",
                        marginTop: "5px",
                        letterSpacing: "0.3px",
                    }}
                >
                    Scan for order identification
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "8px",
                    paddingTop: "7px",
                    borderTop: "1px solid #ddd",
                }}
            >
                <div
                    style={{
                        fontSize: "10px",
                        fontWeight: "700",
                    }}
                >
                    Thank you for shopping with SOUK
                </div>

                <div
                    style={{
                        fontSize: "8px",
                        color: "#777",
                        marginTop: "3px",
                    }}
                >
                    SOUK Fashion House • Packed with care
                </div>
            </div>
        </div>
    );
});

export default PrintShippingLabel;