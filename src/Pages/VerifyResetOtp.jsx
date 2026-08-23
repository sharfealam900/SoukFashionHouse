import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import SEO from "../Components/SEO";


export default function VerifyResetOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {

    if (timer > 0) {

      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    setCanResend(true);

  }, [timer]);

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await api.post(
        "/users/verify-reset-otp",
        {
          email,
          otp,
        }
      );

      toast.success(data.message);

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }

  };

  const resendOtpHandler = async () => {

    try {

      const { data } = await api.post(
        "/users/resend-reset-otp",
        {
          email,
        }
      );

      toast.success(data.message);

      setTimer(60);
      setCanResend(false);

    } catch (error) {

      toast.error(error.response?.data?.message);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          📩
        </div>

        <h2 className="auth-title">
          Verify OTP
        </h2>

        <p className="auth-subtitle">
          We've sent a verification code to your email.
        </p>

        <form onSubmit={submitHandler}>

          <input
            type="text"
            className="form-control auth-input mb-3 text-center"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            className="btn btn-dark auth-btn w-100"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <SEO
          title="VerifyResetOtp | Souk Fashion House"
          noIndex
        />

        <div className="auth-footer">

          <button
            className="resend-btn"
            disabled={!canResend}
            onClick={resendOtpHandler}
          >
            {canResend
              ? "Resend OTP"
              : `Resend OTP in ${timer}s`}
          </button>

          <br />

          <Link
            to="/login"
            className="back-link"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>

  );
}