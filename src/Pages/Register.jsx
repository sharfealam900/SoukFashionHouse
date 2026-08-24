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
    Phone,
    Sparkles,
    UserRound,
} from "lucide-react";

import { registerUser } from "../features/auth/authApi";
import { setLoading, setUser } from "../features/auth/authSlice";
import SEO from "../Components/SEO";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

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

            if (
                formData.password !==
                formData.confirmPassword
            ) {
                return toast.error(
                    "Passwords do not match."
                );
            }

            const {
                confirmPassword,
                ...payload
            } = formData;

            const { data } =
                await registerUser(payload);

            toast.success(data.message);

            sessionStorage.setItem(
                "verifyEmail",
                formData.email
            );

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
        <>
            <SEO
                title="Register | Souk Fashion House"
                noIndex
            />

            <section className="souk-live-register">

                {/* =====================================================
                    ANIMATED BACKGROUND
                ===================================================== */}

                <div className="register-live-background">

                    <div className="register-orb register-orb-a" />
                    <div className="register-orb register-orb-b" />
                    <div className="register-orb register-orb-c" />

                    <div className="register-wave register-wave-one" />
                    <div className="register-wave register-wave-two" />

                    <div className="register-ring register-ring-one" />
                    <div className="register-ring register-ring-two" />
                    <div className="register-ring register-ring-three" />

                </div>


                {/* =====================================================
                    FLOATING PARTICLES
                ===================================================== */}

                <div className="register-particles">

                    <span className="register-particle rp1" />
                    <span className="register-particle rp2" />
                    <span className="register-particle rp3" />
                    <span className="register-particle rp4" />
                    <span className="register-particle rp5" />
                    <span className="register-particle rp6" />
                    <span className="register-particle rp7" />
                    <span className="register-particle rp8" />
                    <span className="register-particle rp9" />
                    <span className="register-particle rp10" />

                </div>


                {/* =====================================================
                    MAIN STAGE
                ===================================================== */}

                <div className="register-live-stage">


                    {/* =================================================
                        BRAND SECTION
                    ================================================= */}

                    <div className="register-brand">

                        <div className="register-floating-symbol">

                            <Sparkles
                                size={18}
                                strokeWidth={1.3}
                            />

                        </div>


                        <div className="register-brand-kicker">
                            JOIN SOUK FASHION HOUSE
                        </div>


                        <h1 className="register-brand-title">

                            <span>
                                Your style.
                            </span>

                            <span className="register-script">
                                Your story.
                            </span>

                            <span>
                                Your Souk.
                            </span>

                        </h1>


                        <p className="register-brand-description">

                            Create your personal space and
                            discover carefully curated pieces
                            inspired by timeless craftsmanship
                            and modern elegance.

                        </p>


                        <div className="register-brand-mark">

                            <span />
                            <small>EST. 2024</small>
                            <span />

                        </div>


                        <div className="register-brand-note">

                            <div className="register-note-line" />

                            <span>
                                CURATED FOR YOU
                            </span>

                            <div className="register-note-line" />

                        </div>

                    </div>


                    {/* =================================================
                        REGISTER CARD
                    ================================================= */}

                    <div className="register-card-wrapper">

                        <div className="register-card-glow" />


                        <div className="register-card">

                            <div className="register-card-border" />

                            <div className="register-card-shine" />


                            <div className="register-card-content">


                                {/* =================================================
                                    CARD TOP
                                ================================================= */}

                                <div className="register-card-top">

                                    <div className="register-mini-brand">
                                        SFH
                                    </div>

                                    <span>
                                        NEW MEMBER
                                    </span>

                                </div>


                                {/* =================================================
                                    HEADING
                                ================================================= */}

                                <div className="register-heading">

                                    <span>
                                        BEGIN YOUR JOURNEY
                                    </span>

                                    <h2>
                                        Create account
                                    </h2>

                                    <p>
                                        Become part of the
                                        Souk Fashion House
                                        community.
                                    </p>

                                </div>


                                {/* =================================================
                                    FORM
                                ================================================= */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="register-form"
                                >


                                    {/* NAME */}

                                    <div className="register-field">

                                        <label htmlFor="register-name">
                                            Full name
                                        </label>

                                        <div className="register-input">

                                            <UserRound
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="register-name"
                                                type="text"
                                                name="name"
                                                placeholder="Your full name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                autoComplete="name"
                                            />

                                        </div>

                                    </div>


                                    {/* EMAIL */}

                                    <div className="register-field">

                                        <label htmlFor="register-email">
                                            Email address
                                        </label>

                                        <div className="register-input">

                                            <Mail
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="register-email"
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
                                            />

                                        </div>

                                    </div>


                                    {/* PHONE */}

                                    <div className="register-field">

                                        <label htmlFor="register-phone">
                                            Phone number
                                            <span>
                                                OPTIONAL
                                            </span>
                                        </label>

                                        <div className="register-input">

                                            <Phone
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="register-phone"
                                                type="text"
                                                name="phone"
                                                placeholder="Your phone number"
                                                value={
                                                    formData.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                autoComplete="tel"
                                            />

                                        </div>

                                    </div>


                                    {/* PASSWORD */}

                                    <div className="register-field">

                                        <label htmlFor="register-password">
                                            Password
                                        </label>

                                        <div className="register-input">

                                            <LockKeyhole
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="register-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                placeholder="Create a password"
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                className="register-password-toggle"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
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


                                    {/* CONFIRM PASSWORD */}

                                    <div className="register-field">

                                        <label htmlFor="register-confirm-password">
                                            Confirm password
                                        </label>

                                        <div
                                            className={`register-input ${
                                                formData.confirmPassword &&
                                                formData.password !==
                                                    formData.confirmPassword
                                                    ? "password-mismatch"
                                                    : ""
                                            }`}
                                        >

                                            <LockKeyhole
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                            <input
                                                id="register-confirm-password"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={
                                                    formData.confirmPassword
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                className="register-password-toggle"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
                                                }
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >

                                                {showConfirmPassword ? (
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


                                    {/* REGISTER BUTTON */}

                                    <button
                                        type="submit"
                                        className="register-submit-button"
                                    >

                                        <span>
                                            CREATE MY ACCOUNT
                                        </span>

                                        <span className="register-button-arrow">

                                            <ArrowRight
                                                size={17}
                                                strokeWidth={1.5}
                                            />

                                        </span>

                                        <span className="register-button-shine" />

                                    </button>

                                </form>


                                {/* =================================================
                                    LOGIN LINK
                                ================================================= */}

                                <div className="register-login-link">

                                    <span>
                                        Already a member?
                                    </span>

                                    <Link to="/login">

                                        Sign in

                                        <ArrowRight
                                            size={13}
                                            strokeWidth={1.6}
                                        />

                                    </Link>

                                </div>


                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                <div className="register-card-footer">

                                    <span>
                                        SECURE REGISTRATION
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


                {/* =====================================================
                    BOTTOM MARK
                ===================================================== */}

                <div className="register-bottom-mark">

                    <span />
                    <small>
                        ENTER THE WORLD OF SOUK
                    </small>
                    <span />

                </div>

            </section>
        </>
    );
}