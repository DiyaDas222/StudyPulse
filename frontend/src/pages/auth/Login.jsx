import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ==========================================
  // Input Change
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Normal Login
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        formData
      );

      login(
        res.data.token,
        res.data.user
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Google Login
  // ==========================================
  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      setGoogleLoading(true);

      if (!credentialResponse?.credential) {
        alert("Google credential not received");
        return;
      }

      const res = await api.post(
        "/auth/google",
        {
          credential:
            credentialResponse.credential,
        }
      );

      login(
        res.data.token,
        res.data.user
      );

      alert("Google Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Google login error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Google Login Failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // Google Login Error
  // ==========================================
  const handleGoogleError = () => {
    console.error("Google Login Failed");

    alert("Google Login Failed");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          StudyPulse Login
        </h1>

        {/* Email */}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border w-full p-3 rounded mb-4"
          required
        />

        {/* Password */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border w-full p-3 rounded mb-4"
          required
        />

        {/* Normal Login */}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded font-semibold transition"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* Divider */}

        <div className="flex items-center gap-3 my-6">

          <div className="flex-1 h-px bg-gray-300" />

          <span className="text-sm text-gray-500">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300" />

        </div>

        {/* Google */}

        <div className="flex justify-center">

          {googleLoading ? (

            <div className="border border-gray-300 rounded-lg px-6 py-3 text-gray-600 font-semibold">
              Signing in with Google...
            </div>

          ) : (

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />

          )}

        </div>

        {/* Register */}

        <p className="text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 ml-2 font-semibold"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;