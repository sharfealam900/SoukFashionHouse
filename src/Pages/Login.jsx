import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { loginUser } from "../features/auth/authApi";
import { setLoading, setUser } from "../features/auth/authSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

            const { data } = await loginUser(formData);
            

            dispatch(setUser(data.user));
          

            toast.success(data.message);

            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <section className="container py-5">
            <div
                className="mx-auto shadow p-4 rounded bg-white"
                style={{ maxWidth: "450px" }}
            >
                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
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

                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
}
