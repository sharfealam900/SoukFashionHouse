import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AddressForm({
  shippingAddress,
  setShippingAddress,
  useProfileAddress,
  setUseProfileAddress,
}) {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && useProfileAddress) {
      setShippingAddress({
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user, useProfileAddress, setShippingAddress]);

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileAddress = () => {
    setUseProfileAddress(true);

    setShippingAddress({
      fullName: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
    });
  };

  const handleAnotherAddress = () => {
    setUseProfileAddress(false);

    setShippingAddress({
      fullName: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  return (
    <div className="checkout-card">

      <h3 className="checkout-title">
        Delivery Address
      </h3>

      {/* Default Address */}

      <div className="border rounded p-3 mb-4">

        <label className="d-flex align-items-start gap-2">

          <input
            type="radio"
            checked={useProfileAddress}
            onChange={handleProfileAddress}
          />

          <div>

            <strong>
              Use My Default Address
            </strong>

            <div className="mt-2">

              <div>{user?.name}</div>

              <div>{user?.phone}</div>

              <div>{user?.email}</div>

              <div style={{ whiteSpace: "pre-line" }}>
                {user?.address || "No address saved"}
              </div>

            </div>

          </div>

        </label>

      </div>

      {/* Another Address */}

      <div className="border rounded p-3">

        <label className="d-flex align-items-center gap-2 mb-3">

          <input
            type="radio"
            checked={!useProfileAddress}
            onChange={handleAnotherAddress}
          />

          <strong>
            Deliver To Another Address
          </strong>

        </label>

        {!useProfileAddress && (

          <div className="checkout-form">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
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
              rows={5}
              name="address"
              placeholder="Complete Shipping Address"
              value={shippingAddress.address}
              onChange={handleChange}
            />

          </div>

        )}

      </div>

    </div>
  );
}