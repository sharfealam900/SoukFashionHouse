import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import OrderSummary from "../Components/Checkout/OrderSummary";
import AddressForm from "../Components/Checkout/AddressForm";
import PaymentMethod from "../Components/Checkout/PaymentMethod";
import PlaceOrder from "../Components/Checkout/PlaceOrder";
import SEO from "../Components/SEO";

export default function Checkout() {
    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [couponCode, setCouponCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(null);
    const [couponApplied, setCouponApplied] = useState(false);

    const [useProfileAddress, setUseProfileAddress] =
        useState(true);

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

    return (
        <>
            <SEO
                title="Checkout | Souk Fashion House"
                noIndex
            />
            <Navbar />

            <main className="checkout-page">

                {/* =========================
                    CHECKOUT HERO
                ========================== */}
                <div className="checkout-container">

                    <div className="checkout-top">

                        <div className="checkout-title-area">
                            <span className="checkout-eyebrow">
                                SOUK FASHION HOUSE
                            </span>

                            <h1 className="checkout-heading">
                                Checkout
                            </h1>

                            <p className="checkout-subtitle">
                                Complete your order securely and
                                effortlessly.
                            </p>
                        </div>

                        {/* SECURITY */}
                        <div className="checkout-security">
                            <span className="security-icon">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>

                                <small>
                                    Your information is protected
                                </small>
                            </div>
                        </div>

                    </div>


                    {/* =========================
                        PROGRESS
                    ========================== */}
                    <div className="checkout-progress">

                        <div className="checkout-step active">
                            <span className="step-number">
                                01
                            </span>

                            <div>
                                <strong>
                                    Delivery
                                </strong>

                                <small>
                                    Address
                                </small>
                            </div>
                        </div>

                        <div className="progress-line active"></div>

                        <div className="checkout-step active">
                            <span className="step-number">
                                02
                            </span>

                            <div>
                                <strong>
                                    Payment
                                </strong>

                                <small>
                                    Method
                                </small>
                            </div>
                        </div>

                        <div className="progress-line"></div>

                        <div className="checkout-step">
                            <span className="step-number">
                                03
                            </span>

                            <div>
                                <strong>
                                    Confirmation
                                </strong>

                                <small>
                                    Place order
                                </small>
                            </div>
                        </div>

                    </div>


                    {/* =========================
                        MAIN CHECKOUT
                    ========================== */}
                    <div className="checkout-layout">

                        {/* =====================
                            LEFT COLUMN
                        ====================== */}
                        <div className="checkout-left">

                            {/* ADDRESS */}
                            <section className="checkout-section-card">

                                <div className="checkout-section-header">

                                    <div className="section-number">
                                        01
                                    </div>

                                    <div>
                                        <h2>
                                            Delivery Address
                                        </h2>

                                        <p>
                                            Where should we deliver
                                            your order?
                                        </p>
                                    </div>

                                </div>

                                <div className="checkout-section-content">
                                    <AddressForm
                                        shippingAddress={
                                            shippingAddress
                                        }
                                        setShippingAddress={
                                            setShippingAddress
                                        }
                                        useProfileAddress={
                                            useProfileAddress
                                        }
                                        setUseProfileAddress={
                                            setUseProfileAddress
                                        }
                                    />
                                </div>

                            </section>


                            {/* PAYMENT */}
                            <section className="checkout-section-card">

                                <div className="checkout-section-header">

                                    <div className="section-number">
                                        02
                                    </div>

                                    <div>
                                        <h2>
                                            Payment Method
                                        </h2>

                                        <p>
                                            Choose how you'd like
                                            to pay.
                                        </p>
                                    </div>

                                </div>

                                <div className="checkout-section-content">

                                    <PaymentMethod
                                        paymentMethod={
                                            paymentMethod
                                        }
                                        setPaymentMethod={
                                            setPaymentMethod
                                        }
                                    />

                                </div>

                            </section>


                            {/* MOBILE ORDER SUMMARY */}
                            <div className="checkout-mobile-summary">

                                <section className="checkout-section-card">

                                    <div className="checkout-section-header">

                                        <div className="section-number">
                                            03
                                        </div>

                                        <div>
                                            <h2>
                                                Order Summary
                                            </h2>

                                            <p>
                                                Review your items
                                                before placing
                                                your order.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="checkout-section-content">

                                        <OrderSummary
                                            couponCode={
                                                couponCode
                                            }
                                            setCouponCode={
                                                setCouponCode
                                            }
                                            discountAmount={
                                                discountAmount
                                            }
                                            setDiscountAmount={
                                                setDiscountAmount
                                            }
                                            finalAmount={
                                                finalAmount
                                            }
                                            setFinalAmount={
                                                setFinalAmount
                                            }
                                            couponApplied={
                                                couponApplied
                                            }
                                            setCouponApplied={
                                                setCouponApplied
                                            }
                                        />

                                    </div>

                                </section>

                            </div>


                            {/* PLACE ORDER */}
                            <section className="place-order-card">

                                <div className="place-order-content">

                                    <div className="place-order-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <h3>
                                            Ready to place your
                                            order?
                                        </h3>

                                        <p>
                                            By placing your order,
                                            you agree to our terms
                                            and conditions.
                                        </p>
                                    </div>

                                </div>

                                <PlaceOrder
                                    shippingAddress={
                                        shippingAddress
                                    }
                                    paymentMethod={
                                        paymentMethod
                                    }
                                    useProfileAddress={
                                        useProfileAddress
                                    }
                                    couponCode={
                                        couponCode
                                    }
                                />

                            </section>

                        </div>


                        {/* =====================
                            RIGHT COLUMN
                        ====================== */}
                        <aside className="checkout-right">

                            <div className="checkout-summary-sticky">

                                <div className="summary-top">

                                    <div>
                                        <span>
                                            YOUR ORDER
                                        </span>

                                        <h2>
                                            Order Summary
                                        </h2>
                                    </div>

                                    <div className="summary-bag-icon">
                                        ♡
                                    </div>

                                </div>

                                <OrderSummary
                                    couponCode={
                                        couponCode
                                    }
                                    setCouponCode={
                                        setCouponCode
                                    }
                                    discountAmount={
                                        discountAmount
                                    }
                                    setDiscountAmount={
                                        setDiscountAmount
                                    }
                                    finalAmount={
                                        finalAmount
                                    }
                                    setFinalAmount={
                                        setFinalAmount
                                    }
                                    couponApplied={
                                        couponApplied
                                    }
                                    setCouponApplied={
                                        setCouponApplied
                                    }
                                />

                                <div className="summary-trust">

                                    <div>
                                        <span>✓</span>
                                        Secure payment
                                    </div>

                                    <div>
                                        <span>✓</span>
                                        Easy returns
                                    </div>

                                    <div>
                                        <span>✓</span>
                                        Premium quality
                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}