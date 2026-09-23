import React, { useState } from "react";
import {
    MapPin,
    Truck,
    CheckCircle,
    Globe2,
    RotateCcw
} from "lucide-react";
import ReturnPolicy from "../ReturnPolicy/ReturnPolicy";

const DELIVERY_DAYS = {
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 5,
    "9": 8
};

const getDeliveryDays = (pincode) => {
    if (pincode.startsWith("11")) {
        return { min: 1, max: 2 };
    }

    if (pincode.startsWith("12")) {
        return { min: 2, max: 3 };
    }

    if (pincode.startsWith("13")) {
        return { min: 2, max: 3 };
    }

    if (pincode.startsWith("14")) {
        return { min: 2, max: 3 };
    }

    if (pincode.startsWith("15")) {
        return { min: 2, max: 4 };
    }

    if (pincode.startsWith("16")) {
        return { min: 2, max: 4 };
    }

    const firstDigit = pincode.charAt(0);
    const maxDays = DELIVERY_DAYS[firstDigit] || 7;

    return {
        min: Math.max(2, maxDays - 2),
        max: maxDays
    };
};

const addBusinessDays = (date, days) => {
    const result = new Date(date);
    let addedDays = 0;

    while (addedDays < days) {
        result.setDate(result.getDate() + 1);

        if (result.getDay() !== 0) {
            addedDays++;
        }
    }

    return result;
};

const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
};

const DeliveryEstimator = () => {
    const [pincode, setPincode] = useState("");
    const [delivery, setDelivery] = useState(null);
    const [error, setError] = useState("");
    const [showReturnPolicy, setShowReturnPolicy] = useState(false);

    const checkDelivery = () => {
        const value = pincode.trim();

        if (!/^[1-9][0-9]{5}$/.test(value)) {
            setDelivery(null);
            setError("Please enter a valid 6-digit PIN code");
            return;
        }

        setError("");

        const { min, max } = getDeliveryDays(value);
        const today = new Date();

        const minDate = addBusinessDays(today, min);
        const maxDate = addBusinessDays(today, max);

        setDelivery({
            pincode: value,
            minDate,
            maxDate
        });
    };

    const handleChange = (event) => {
        const value = event.target.value
            .replace(/\D/g, "")
            .slice(0, 6);

        setPincode(value);
        setDelivery(null);
        setError("");
    };

    return (
        <>
            <div className="souk-delivery-estimator">
                <div className="souk-myntra-heading">
                    <span>DELIVERY OPTIONS</span>

                    <Truck
                        size={15}
                        strokeWidth={1.8}
                    />
                </div>

                <div className="souk-pincode-box">
                    <div className="souk-pincode-input-wrap">
                        <MapPin
                            size={16}
                            strokeWidth={1.8}
                        />

                        <input
                            type="text"
                            value={pincode}
                            onChange={handleChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    checkDelivery();
                                }
                            }}
                            placeholder="Enter PIN code"
                            inputMode="numeric"
                            maxLength={6}
                        />

                        {pincode.length === 6 && (
                            <button
                                type="button"
                                onClick={checkDelivery}
                            >
                                CHECK
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="souk-pincode-error">
                            {error}
                        </p>
                    )}
                </div>

                <div className="souk-delivery-info">
                    <div className="souk-delivery-row">
                        <Globe2
                            className="souk-delivery-row-icon"
                            size={14}
                            strokeWidth={1.7}
                        />

                        <span>
                            Pan-India delivery available
                        </span>
                    </div>

                    {delivery && (
                        <>
                            <div className="souk-delivery-row">
                                <CheckCircle
                                    className="souk-delivery-row-icon souk-success-icon"
                                    size={14}
                                    strokeWidth={1.7}
                                />

                                <span>
                                    Delivery available to{" "}
                                    <strong>
                                        {delivery.pincode}
                                    </strong>
                                </span>
                            </div>

                            <div className="souk-delivery-row">
                                <Truck
                                    className="souk-delivery-row-icon"
                                    size={14}
                                    strokeWidth={1.7}
                                />

                                <span>
                                    Get it by{" "}
                                    <strong>
                                        {formatDate(delivery.minDate)}
                                        {" - "}
                                        {formatDate(delivery.maxDate)}
                                    </strong>
                                </span>
                            </div>
                        </>
                    )}

                    <div className="souk-delivery-row">
                        <span className="souk-delivery-symbol">
                            💵
                        </span>

                        <span>
                            Cash on Delivery available
                        </span>
                    </div>

                    <div className="souk-delivery-row">
                        <span className="souk-delivery-symbol">
                            ↩
                        </span>

                        <span>
                            Easy 7 days returns on eligible orders
                        </span>
                    </div>

                    <button
                        type="button"
                        className="return-policy-button"
                        onClick={() => setShowReturnPolicy(true)}
                    >
                        <RotateCcw
                            size={14}
                            strokeWidth={1.8}
                        />

                        <span>
                            Return Policy
                        </span>
                    </button>
                </div>
            </div>

            {showReturnPolicy && (
                <ReturnPolicy
                    onClose={() => setShowReturnPolicy(false)}
                />
            )}
        </>
    );
};

export default DeliveryEstimator;