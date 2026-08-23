import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Truck, CheckCircle2, MapPin, ArrowRight } from "lucide-react";

export default function AddressForm({
  shippingAddress,
  setShippingAddress,
  useProfileAddress,
  setUseProfileAddress,
}) {
  const { user } = useSelector((state) => state.auth);

  // Load profile address when default address is selected
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
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
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
    <div className="delivery-address-card">

      {/* HEADER */}
      <div className="delivery-address-header">
        <div className="delivery-header-icon">
          <Truck size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h2>Delivery Address</h2>
          <p>Where should we deliver your order?</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="delivery-address-content">

        {/* DEFAULT ADDRESS */}
        <label
          className={`address-option ${
            useProfileAddress ? "active" : ""
          }`}
        >
          <input
            type="radio"
            name="checkoutAddressType"
            checked={useProfileAddress}
            onChange={handleProfileAddress}
          />

          <span className="custom-radio">
            {useProfileAddress && <span />}
          </span>

          <div className="address-option-content">

            <div className="address-option-title">
              <strong>Use My Default Address</strong>

              {useProfileAddress && (
                <span className="address-selected">
                  <CheckCircle2 size={14} />
                  Selected
                </span>
              )}
            </div>

            {useProfileAddress && (
              <div className="default-address-preview">

                {user?.name && (
                  <strong className="default-name">
                    {user.name}
                  </strong>
                )}

                {user?.phone && (
                  <span>{user.phone}</span>
                )}

                {user?.email && (
                  <span>{user.email}</span>
                )}

                {user?.address ? (
                  <span className="default-address">
                    <MapPin size={14} />
                    {user.address}
                  </span>
                ) : (
                  <span className="no-address">
                    No address saved
                  </span>
                )}

              </div>
            )}

          </div>
        </label>

        {/* ANOTHER ADDRESS */}
        <label
          className={`address-option ${
            !useProfileAddress ? "active" : ""
          }`}
        >
          <input
            type="radio"
            name="checkoutAddressType"
            checked={!useProfileAddress}
            onChange={handleAnotherAddress}
          />

          <span className="custom-radio">
            {!useProfileAddress && <span />}
          </span>

          <div className="address-option-content">

            <div className="address-option-title">
              <strong>Deliver To Another Address</strong>
            </div>

          </div>
        </label>

        {/* NEW ADDRESS FORM */}
        {!useProfileAddress && (
          <div className="new-address-form">

            {/* FULL NAME */}
            <div className="address-field">
              <label>
                FULL NAME <span>*</span>
              </label>

              <input
                type="text"
                name="fullName"
                value={shippingAddress?.fullName || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* PHONE */}
            <div className="address-field">
              <label>
                PHONE <span>*</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={shippingAddress?.phone || ""}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>

            {/* EMAIL */}
            <div className="address-field">
              <label>
                EMAIL <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={shippingAddress?.email || ""}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>

            {/* ADDRESS */}
            <div className="address-field">
              <label>
                DELIVERY ADDRESS <span>*</span>
              </label>

              <div className="address-input-wrapper">
                <MapPin size={18} />

                <textarea
                  name="address"
                  value={shippingAddress?.address || ""}
                  onChange={handleChange}
                  placeholder="House no., street, area, landmark..."
                  rows={4}
                />
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}