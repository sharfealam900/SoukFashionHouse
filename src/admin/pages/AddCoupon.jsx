import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createCoupon,
    getCoupon,
    updateCoupon,
} from "../services/couponApi";

export default function AddCoupon() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minimumOrderAmount: "",
        maximumDiscount: "",
        usageLimit: "",
        expiresAt: "",
        isActive: true,
    });

    useEffect(() => {
        if (isEdit) {
            loadCoupon();
        }
    }, [id]);

    const loadCoupon = async () => {
        try {
            const { data } = await getCoupon(id);

            const coupon = data.coupon;

            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minimumOrderAmount:
                    coupon.minimumOrderAmount,
                maximumDiscount:
                    coupon.maximumDiscount,
                usageLimit: coupon.usageLimit,
                expiresAt: coupon.expiresAt
                    ? coupon.expiresAt.slice(0, 16)
                    : "",
                isActive: coupon.isActive,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load coupon."
            );
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } =
            e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (isEdit) {
                await updateCoupon(id, formData);

                toast.success(
                    "Coupon updated successfully."
                );
            } else {
                await createCoupon(formData);

                toast.success(
                    "Coupon created successfully."
                );
            }

            navigate("/admin/coupons");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save coupon."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">

            <h2 className="fw-bold mb-4">
                {isEdit
                    ? "Edit Coupon"
                    : "Create Coupon"}
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="card shadow-sm">

                    <div className="card-body">

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Coupon Code
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Discount Type
                                </label>

                                <select
                                    className="form-select"
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                >
                                    <option value="percentage">
                                        Percentage
                                    </option>

                                    <option value="fixed">
                                        Fixed Amount
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Discount Value
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Minimum Order Amount
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="minimumOrderAmount"
                                    value={formData.minimumOrderAmount}
                                    onChange={handleChange}
                                />

                            </div>
                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Maximum Discount
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="maximumDiscount"
                                    value={formData.maximumDiscount}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Usage Limit
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Expiry Date
                                </label>

                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="expiresAt"
                                    value={formData.expiresAt}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 d-flex align-items-center">

                                <div className="form-check mt-4">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="activeCoupon"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="activeCoupon"
                                    >
                                        Active Coupon
                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-4 d-flex gap-3">

                    <button
                        type="submit"
                        className="btn btn-dark px-5"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Coupon"
                                : "Create Coupon"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/admin/coupons")
                        }
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}