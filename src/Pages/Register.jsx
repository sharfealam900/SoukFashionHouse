import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { registerUser } from "../features/auth/authApi";
import { setLoading, setUser } from "../features/auth/authSlice";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true));

            if (formData.password !== formData.confirmPassword) {
                return toast.error(
                    "Passwords do not match."
                );
            }

            const { confirmPassword, ...payload } = formData;

            const { data } = await registerUser(payload);

            toast.success(data.message);

            // Save email temporarily
            sessionStorage.setItem(
                "verifyEmail",
                formData.email
            );

            // Go to OTP page
            navigate("/verify-otp");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <section className="container py-5">
            <div
                className="mx-auto shadow p-4 rounded bg-white"
                style={{ maxWidth: "500px" }}
            >
                <h2 className="text-center mb-4">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>

                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>

                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            placeholder="Enter phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>

                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>





                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 mb-0">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}