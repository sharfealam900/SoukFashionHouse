import React, { useMemo, useState } from "react";
import {
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { changePassword } from "../features/auth/authApi";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const passwordStrength = useMemo(() => {
        const password = formData.newPassword;

        if (!password) {
            return {
                width: "0%",
                label: "",
                className: "",
            };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {
            return {
                width: "35%",
                label: "Weak",
                className: "weak",
            };
        }

        if (score <= 4) {
            return {
                width: "70%",
                label: "Medium",
                className: "medium",
            };
        }

        return {
            width: "100%",
            label: "Strong",
            className: "strong",
        };
    }, [formData.newPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            return toast.error("Please fill all fields.");
        }

        if (formData.newPassword.length < 8) {
            return toast.error(
                "Password must contain at least 8 characters."
            );
        }

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            setLoading(true);

            const { data } = await changePassword(formData);

            toast.success(data.message);

            navigate("/profile");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="profile-page">
                <div className="change-password-card">

                    <div className="password-header">

                        <div className="password-icon">
                            <ShieldCheck size={40} />
                        </div>

                        <h2>Change Password</h2>

                        <p>
                            Keep your account secure by updating your
                            password regularly.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="password-group">

                            <label>Current Password</label>

                            <div className="password-field">

                                <Lock size={18} />

                                <input
                                    type={showCurrent ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder="Enter your current password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(!showCurrent)
                                    }
                                >
                                    {showCurrent ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <div className="password-group">

                            <label>New Password</label>

                            <div className="password-field">

                                <Lock size={18} />

                                <input
                                    type={showNew ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Create a new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNew(!showNew)
                                    }
                                >
                                    {showNew ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            <div className="strength-box">

                                <div className="strength-top">

                                    <span>Password Strength</span>

                                    <span
                                        className={passwordStrength.className}
                                    >
                                        {passwordStrength.label}
                                    </span>

                                </div>

                                <div className="strength-bar">

                                    <div
                                        className={`strength-fill ${passwordStrength.className}`}
                                        style={{
                                            width: passwordStrength.width,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="password-group">

                            <label>Confirm Password</label>

                            <div className="password-field">

                                <Lock size={18} />

                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(!showConfirm)
                                    }
                                >
                                    {showConfirm ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <div className="password-info">

                            <h4>Password Requirements</h4>

                            <ul>

                                <li>
                                    <span>✓</span>
                                    Minimum 8 characters
                                </li>

                                <li>
                                    <span>✓</span>
                                    At least one uppercase letter
                                </li>

                                <li>
                                    <span>✓</span>
                                    At least one lowercase letter
                                </li>

                                <li>
                                    <span>✓</span>
                                    At least one number
                                </li>

                                <li>
                                    <span>✓</span>
                                    One special character (recommended)
                                </li>

                            </ul>

                        </div>

                        <div className="password-footer">

                            <button
                                type="button"
                                className="btn-light"
                                onClick={() => navigate("/profile")}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn-dark"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loader"></span>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>

                        </div>

                    </form>

                </div>

            </section>

            <Footer />

        </>
    );
}