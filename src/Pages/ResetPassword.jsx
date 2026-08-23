import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import SEO from "../Components/SEO";


export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/users/reset-password", {
        email,
        password,
        confirmPassword,
      });

      toast.success(data.message);

      navigate("/login");

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <form
        onSubmit={submitHandler}
        className="mx-auto"
        style={{ maxWidth: 450 }}
      >
        <h2 className="mb-4 text-center">
          Reset Password
        </h2>

        <SEO
    title="ResetPassword | Souk Fashion House"
    noIndex
/>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="btn btn-dark w-100"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}