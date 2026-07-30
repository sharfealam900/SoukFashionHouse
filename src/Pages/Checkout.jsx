import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import OrderSummary from "../Components/Checkout/OrderSummary";
import AddressForm from "../Components/Checkout/AddressForm";
import PaymentMethod from "../Components/Checkout/PaymentMethod";
import PlaceOrder from "../Components/Checkout/PlaceOrder";

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

    const [paymentMethod, setPaymentMethod] = useState("COD");
    return (
        <>
            <Navbar />

            <section className="checkout-page container py-5">

                <h1 className="checkout-heading">
                    Checkout
                </h1>

                <div className="checkout-layout">

                    <div className="checkout-left">
                        <AddressForm
                            shippingAddress={shippingAddress}
                            setShippingAddress={setShippingAddress}
                            useProfileAddress={useProfileAddress}
                            setUseProfileAddress={setUseProfileAddress}
                        />
                    </div>

                    <div className="checkout-right">
                        <OrderSummary
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            discountAmount={discountAmount}
                            setDiscountAmount={setDiscountAmount}
                            finalAmount={finalAmount}
                            setFinalAmount={setFinalAmount}
                            couponApplied={couponApplied}
                            setCouponApplied={setCouponApplied}
                        />

                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />

                        <PlaceOrder
                            shippingAddress={shippingAddress}
                            paymentMethod={paymentMethod}
                            useProfileAddress={useProfileAddress}
                            couponCode={couponCode}
                        />
                    </div>
                </div>

            </section>

            <Footer />
        </>
    );
}