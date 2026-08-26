import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Sparkles,
} from "lucide-react";

import { loginUser } from "../features/auth/authApi";
import { setUser } from "../features/auth/authSlice";
import SEO from "../Components/SEO";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

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

        if (submitting) {
            return;
        }

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            toast.error(
                "Email and password are required."
            );
            return;
        }

        try {
            setSubmitting(true);

            const { data } = await loginUser({
                email,
                password,
            });

            if (!data?.success || !data?.user) {
                throw new Error(
                    data?.message || "Login failed."
                );
            }

            dispatch(setUser(data.user));

            toast.success(
                data.message || "Login successful."
            );

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            const message =
                error.response?.data?.message ||
                (error.code === "ECONNABORTED"
                    ? "Server took too long to respond. Please try again."
                    : error.message) ||
                "Login failed.";

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Login | Souk Fashion House"
                noIndex
            />

            <section className="souk-live-login">
                <div className="login-live-background">
                    <div className="login-gradient-orb orb-a" />
                    <div className="login-gradient-orb orb-b" />
                    <div className="login-gradient-orb orb-c" />

                    <div className="login-light-wave wave-one" />
                    <div className="login-light-wave wave-two" />

                    <div className="login-ring ring-one" />
                    <div className="login-ring ring-two" />
                    <div className="login-ring ring-three" />
                </div>

                <div className="login-particles">
                    <span className="particle p1" />
                    <span className="particle p2" />
                    <span className="particle p3" />
                    <span className="particle p4" />
                    <span className="particle p5" />
                    <span className="particle p6" />
                    <span className="particle p7" />
                    <span className="particle p8" />
                    <span className="particle p9" />
                    <span className="particle p10" />
                </div>

                <div className="live-login-stage">
                    <div className="live-brand">
                        <div className="brand-floating-symbol">
                            <Sparkles
                                size={18}
                                strokeWidth={1.3}
                            />
                        </div>

                        <div className="brand-kicker">
                            SOUK FASHION HOUSE
                        </div>

                        <h1 className="brand-title">
                            <span>Elegance</span>

                            <span className="brand-title-script">
                                in every
                            </span>

                            <span>detail.</span>
                        </h1>

                        <p className="brand-description">
                            A curated world of timeless
                            craftsmanship, luxurious textures
                            and contemporary Indian elegance.
                        </p>

                        <div className="brand-establishment">
                            <span className="brand-line" />

                            <span>
                                EST. 2024
                            </span>

                            <span className="brand-line" />
                        </div>
                    </div>

                    <div className="live-login-card-wrap">
                        <div className="login-card-glow" />

                        <div className="live-login-card">
                            <div className="login-card-border" />

                            <div className="login-card-shine" />

                            <div className="live-login-content">
                                <div className="live-login-header">
                                    <div className="mini-brand">
                                        SFH
                                    </div>

                                    <span>
                                        MEMBER ACCESS
                                    </span>
                                </div>

                                <div className="live-login-heading">
                                    <span className="heading-small">
                                        WELCOME BACK
                                    </span>

                                    <h2>
                                        Sign in
                                    </h2>

                                    <p>
                                        Continue your journey
                                        with Souk Fashion House.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="live-login-form"
                                >
                                    <div className="live-field">
                                        <label htmlFor="login-email">
                                            Email address
                                        </label>

                                        <div className="live-input">
                                            <Mail
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="login-email"
                                                type="email"
                                                name="email"
                                                placeholder="you@example.com"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                autoComplete="email"
                                                disabled={
                                                    submitting
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="live-field">
                                        <div className="live-password-label">
                                            <label htmlFor="login-password">
                                                Password
                                            </label>

                                            <Link
                                                to="/forgot-password"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>

                                        <div className="live-input">
                                            <LockKeyhole
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="login-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                placeholder="Enter your password"
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                autoComplete="current-password"
                                                disabled={
                                                    submitting
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="live-password-toggle"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
                                                }
                                                disabled={
                                                    submitting
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff
                                                        size={16}
                                                        strokeWidth={1.5}
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={16}
                                                        strokeWidth={1.5}
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="live-login-button"
                                        disabled={submitting}
                                        aria-busy={
                                            submitting
                                        }
                                    >
                                        <span className="button-text">
                                            {submitting
                                                ? "ENTERING..."
                                                : "ENTER THE HOUSE"}
                                        </span>

                                        <span className="button-arrow">
                                            <ArrowRight
                                                size={17}
                                                strokeWidth={1.5}
                                            />
                                        </span>

                                        <span className="button-shine" />
                                    </button>
                                </form>

                                <div className="live-register">
                                    <span>
                                        New to Souk?
                                    </span>

                                    <Link to="/register">
                                        Create your account

                                        <ArrowRight
                                            size={13}
                                            strokeWidth={1.6}
                                        />
                                    </Link>
                                </div>

                                <div className="live-card-footer">
                                    <span>
                                        SECURE ACCESS
                                    </span>

                                    <i />

                                    <span>
                                        SOUK 2024
                                    </span>

                                    <i />

                                    <span>
                                        PRIVATE COLLECTION
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-bottom-mark">
                    <span />
                    <small>
                        SCROLL TO EXPLORE
                    </small>
                    <span />
                </div>
            </section>
        </>
    );
}