import React from "react";

export default function AddressForm({
  shippingAddress,
  setShippingAddress,
}) {

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="checkout-card">
      <h3 className="checkout-title">
        Shipping Address
      </h3>

      <div className="checkout-form">

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={shippingAddress.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={shippingAddress.email}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="House No, Street, Area..."
          rows="4"
          value={shippingAddress.address}
          onChange={handleChange}
        />

        <div className="checkout-grid">

          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingAddress.state}
            onChange={handleChange}
          />

        </div>

        <input
          type="text"
          name="pincode"
          placeholder="PIN Code"
          value={shippingAddress.pincode}
          onChange={handleChange}
        />

      </div>
    </div>
  );
}