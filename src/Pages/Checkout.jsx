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
        city: "",
        state: "",
        pincode: "",
    });

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
                        />
                    </div>

                    <div className="checkout-right">
                        <OrderSummary />
                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                        <PlaceOrder
                            shippingAddress={shippingAddress}
                            paymentMethod={paymentMethod}
                        />
                    </div>

                </div>

            </section>

            <Footer />
        </>
    );
}