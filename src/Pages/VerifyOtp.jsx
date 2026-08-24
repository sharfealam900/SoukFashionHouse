import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setUser } from "../features/auth/authSlice";
import api from "../api/axios";
import SEO from "../Components/SEO";


export default function VerifyOtp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = sessionStorage.getItem("verifyEmail");

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);



    const handleVerify = async (e) => {
        e.preventDefault();

        const enteredOtp = otp.join("");

        if (!email) {
            toast.error("Verification email not found. Please register again.");
            navigate("/register");
            return;
        }

        if (!/^\d{6}$/.test(enteredOtp)) {
            toast.error("Enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const { data } = await api.post(
                "/users/verify-register-otp",
                {
                    email,
                    otp: enteredOtp,
                }
            );

            dispatch(setUser(data.user));

            sessionStorage.removeItem("verifyEmail");

            toast.success(data.message || "Email verified successfully.");

            navigate("/");
        } catch (error) {
            console.error(
                "OTP verification error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {

            const { data } = await api.post(
                "/users/resend-register-otp",
                {
                    email,
                }
            );

            toast.success(data.message);

            setSeconds(30);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to resend OTP."
            );

        }
    };



    const handleOtpChange = (value, index) => {

        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);

        if (value && index < 5) {
            document
                .getElementById(`otp-${index + 1}`)
                ?.focus();
        }
    };

    const handleKeyDown = (e, index) => {

        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            document
                .getElementById(`otp-${index - 1}`)
                ?.focus();
        }

    };

    const handlePaste = (e) => {

        e.preventDefault();

        const pasted =
            e.clipboardData
                .getData("text")
                .trim();

        if (!/^\d{6}$/.test(pasted))
            return;

        setOtp(pasted.split(""));
    };







    return (
        <section className="container py-5">

            <div
                className="mx-auto shadow rounded p-4 bg-white"
                style={{ maxWidth: "450px" }}
            >

                <h2 className="text-center mb-3">
                    Verify Email
                </h2>

                <SEO
                    title="VerifyOtp | Souk Fashion House"
                    noIndex
                />

                <p className="text-center text-muted">
                    Enter the OTP sent to
                    <br />
                    <strong>{email}</strong>
                </p>

                <form onSubmit={handleVerify}>

                    <div className="d-flex justify-content-center gap-2 mb-4">

                        {otp.map((digit, index) => (

                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                maxLength={1}
                                className="form-control text-center fw-bold"
                                style={{
                                    width: "55px",
                                    height: "60px",
                                    fontSize: "22px",
                                }}
                                onChange={(e) =>
                                    handleOtpChange(
                                        e.target.value,
                                        index
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                onPaste={handlePaste}
                            />

                        ))}

                    </div>

                    <button
                        className="btn btn-dark w-100"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>

                <div className="text-center mt-3">

                    {seconds > 0 ? (

                        <small className="text-muted">
                            Resend OTP in {seconds}s
                        </small>

                    ) : (

                        <button
                            type="button"
                            className="btn btn-link"
                            onClick={handleResend}
                        >
                            Resend OTP
                        </button>

                    )}

                </div>

            </div>

        </section>
    );
}