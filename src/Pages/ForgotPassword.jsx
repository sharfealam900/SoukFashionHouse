import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import SEO from "../Components/SEO";


export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/users/forgot-password", {
        email,
      });

      toast.success(data.message);

      navigate("/verify-reset-otp", {
        state: { email },
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🔒
        </div>

        <h2 className="auth-title">
          Forgot Password
        </h2>

        <p className="auth-subtitle">
          Enter your registered email to receive an OTP.
        </p>

        <SEO
          title="ForgetPassword | Souk Fashion House"
          noIndex
        />

        <form onSubmit={submitHandler}>

          <input
            type="email"
            className="form-control auth-input mb-3"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="btn btn-dark auth-btn w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>

        <div className="auth-footer">
          <Link
            to="/login"
            className="back-link"
          >
            ← Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
}