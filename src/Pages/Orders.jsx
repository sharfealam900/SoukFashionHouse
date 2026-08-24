import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { getMyOrders } from "../features/order/orderApi";
import SEO from "../Components/SEO";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getMyOrders();

      

            const receivedOrders = Array.isArray(data?.orders)
                ? data.orders
                : [];

            /*
             * Remove duplicate orders using MongoDB _id.
             * This prevents:
             * "Encountered two children with the same key"
             */
            const uniqueOrders = Array.from(
                new Map(
                    receivedOrders.map((order) => [
                        String(order._id),
                        order,
                    ])
                ).values()
            );

            setOrders(uniqueOrders);
        } catch (error) {
            console.error(
                "Failed to fetch orders:",
                error.response?.data || error.message
            );

            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "order-status delivered";

            case "cancelled":
            case "canceled":
                return "order-status cancelled";

            case "shipped":
                return "order-status shipped";

            case "out for delivery":
                return "order-status shipped";

            case "packed":
                return "order-status processing";

            case "processing":
                return "order-status processing";

            case "confirmed":
                return "order-status confirmed";

            case "pending":
                return "order-status pending";

            default:
                return "order-status";
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getProductImage = (product) => {
        if (!product) return null;

        /*
         * Supports:
         * product.images = ["image1", "image2"]
         * product.images = [{ url: "..." }]
         * product.image = "..."
         * product.imageUrl = "..."
         */

        if (Array.isArray(product.images) && product.images.length > 0) {
            const firstImage = product.images[0];

            if (typeof firstImage === "string") {
                return firstImage;
            }

            if (typeof firstImage === "object") {
                return (
                    firstImage.url ||
                    firstImage.secure_url ||
                    firstImage.path ||
                    null
                );
            }
        }

        if (typeof product.image === "string") {
            return product.image;
        }

        if (typeof product.imageUrl === "string") {
            return product.imageUrl;
        }

        return null;
    };

    if (loading) {
        return (
            <>
                <SEO
                    title="Orders | Souk Fashion House"
                    noIndex
                />

                <Navbar />

                <main className="orders-page">
                    <div className="orders-container">
                        <div className="orders-loading">
                            <div className="orders-spinner"></div>

                            <p>
                                Loading your orders...
                            </p>
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <SEO
                title="Orders | Souk Fashion House"
                noIndex
            />

            <Navbar />

            <main className="orders-page">
                <div className="orders-container">

                    {/* =========================
                        PAGE HEADER
                    ========================= */}

                    <div className="orders-header">

                        <div>
                            <span className="orders-eyebrow">
                                SOUK FASHION HOUSE
                            </span>

                            <h1>
                                My <em>Orders</em>
                            </h1>

                            <p>
                                Every purchase, carefully preserved
                                in one place.
                            </p>
                        </div>

                        {orders.length > 0 && (
                            <div className="orders-count">
                                <strong>
                                    {orders.length}
                                </strong>

                                <span>
                                    COLLECTION
                                    <small>
                                        {orders.length === 1
                                            ? "Order"
                                            : "Orders"}
                                    </small>
                                </span>
                            </div>
                        )}
                    </div>


                    {/* =========================
                        DECORATIVE DIVIDER
                    ========================= */}

                    <div className="orders-divider">
                        <span></span>
                        <i></i>
                        <span></span>
                    </div>


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {orders.length === 0 ? (
                        <div className="empty-orders">

                            <div className="empty-orders-icon">
                                🛍️
                            </div>

                            <h2>
                                No orders yet
                            </h2>

                            <p>
                                You haven't placed any orders yet.
                                Start exploring our collection and
                                your purchases will appear here.
                            </p>

                            <Link
                                to="/shop"
                                className="shop-now-btn"
                            >
                                Explore Collection
                                <span>→</span>
                            </Link>

                        </div>
                    ) : (

                        /* =========================
                           ORDERS LIST
                        ========================= */

                        <div className="orders-list">

                            {orders.map((order) => {

                                const orderId = String(
                                    order._id
                                );

                                const status =
                                    order.orderStatus ||
                                    "Pending";

                                const paymentMethod =
                                    order.paymentMethod ||
                                    "COD";

                                const items =
                                    Array.isArray(order.items)
                                        ? order.items
                                        : [];

                                const totalAmount =
                                    Number(
                                        order.finalAmount ??
                                        order.totalAmount ??
                                        0
                                    );

                                return (
                                    <article
                                        key={orderId}
                                        className="order-card"
                                    >

                                        {/* =====================
                                            ORDER HEADER
                                        ===================== */}

                                        <div className="order-card-top">

                                            <div className="order-main-info">

                                                <span className="order-label">
                                                    ORDER
                                                </span>

                                                <div className="order-title-row">

                                                    <h2>
                                                        #
                                                        {orderId
                                                            .slice(-6)
                                                            .toUpperCase()}
                                                    </h2>

                                                    {order.createdAt && (
                                                        <span className="order-date">
                                                            Placed on{" "}
                                                            {formatDate(
                                                                order.createdAt
                                                            )}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={getStatusClass(
                                                    status
                                                )}
                                            >
                                                <span className="status-dot"></span>

                                                {status}
                                            </span>

                                        </div>


                                        {/* =====================
                                            ORDER INFO
                                        ===================== */}

                                        <div className="order-info-grid">

                                            <div className="order-info-item">

                                                <span className="order-info-label">
                                                    PLACED ON
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="order-info-item">

                                                <span className="order-info-label">
                                                    ITEMS
                                                </span>

                                                <strong>
                                                    {items.length}{" "}
                                                    {items.length === 1
                                                        ? "Item"
                                                        : "Items"}
                                                </strong>

                                            </div>


                                            <div className="order-info-item">

                                                <span className="order-info-label">
                                                    PAYMENT
                                                </span>

                                                <strong>
                                                    {paymentMethod ===
                                                    "RAZORPAY"
                                                        ? "Razorpay"
                                                        : paymentMethod}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =====================
                                            PURCHASED PRODUCTS
                                        ===================== */}

                                        <div className="order-products">

                                            <span className="order-products-label">
                                                PURCHASED PIECES
                                            </span>

                                            {items.length > 0 ? (

                                                <div className="order-product-list">

                                                    {items.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {

                                                            const product =
                                                                item.product;

                                                            const image =
                                                                getProductImage(
                                                                    product
                                                                );

                                                            /*
                                                             * IMPORTANT:
                                                             * item._id is disabled
                                                             * in your schema
                                                             * (_id: false)
                                                             *
                                                             * Therefore use a
                                                             * combination of
                                                             * product id + index.
                                                             */

                                                            const itemKey =
                                                                `${product?._id || "product"}-${index}`;

                                                            return (
                                                                <div
                                                                    key={
                                                                        itemKey
                                                                    }
                                                                    className="order-product"
                                                                >

                                                                    <div className="order-product-image">

                                                                        {image ? (
                                                                            <img
                                                                                src={
                                                                                    image
                                                                                }
                                                                                alt={
                                                                                    product?.name ||
                                                                                    "Purchased product"
                                                                                }

                                                                                onError={(
                                                                                    e
                                                                                ) => {
                                                                                    e.currentTarget.style.display =
                                                                                        "none";
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="order-product-placeholder">
                                                                                {product?.name?.charAt(
                                                                                    0
                                                                                ) ||
                                                                                    "S"}
                                                                            </div>
                                                                        )}

                                                                    </div>


                                                                    <div className="order-product-info">

                                                                        <strong>
                                                                            {product?.name ||
                                                                                "Product"}
                                                                        </strong>

                                                                        <span>
                                                                            Qty:{" "}
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            ) : (

                                                <p className="no-products">
                                                    No product information
                                                    available.
                                                </p>

                                            )}

                                        </div>


                                        {/* =====================
                                            BOTTOM
                                        ===================== */}

                                        <div className="order-card-bottom">

                                            <div className="order-payment">

                                                <span className="payment-icon">
                                                    ₹
                                                </span>

                                                <div>
                                                    <span>
                                                        PAYMENT METHOD
                                                    </span>

                                                    <strong>
                                                        {paymentMethod ===
                                                        "RAZORPAY"
                                                            ? "Razorpay"
                                                            : "Cash on Delivery"}
                                                    </strong>
                                                </div>

                                            </div>


                                            <div className="order-total-wrapper">

                                                <div className="order-total">

                                                    <span>
                                                        TOTAL
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {totalAmount.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>


                                                <Link
                                                    to={`/orders/${orderId}`}
                                                    className="view-order-btn"
                                                >
                                                    View Details

                                                    <span>
                                                        →
                                                    </span>
                                                </Link>

                                            </div>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}