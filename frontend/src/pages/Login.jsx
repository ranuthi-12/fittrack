import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { LOGIN_BENEFITS } from "../data/landingData";
import { Eye, EyeOff, X, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRouteByRole = (role) => {
    const normalizedRole = (role || "MEMBER").toUpperCase();
    if (normalizedRole === "ADMIN") navigate("/admin");
    else if (normalizedRole === "TRAINER") navigate("/trainer");
    else navigate("/member");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authAPI.login(form);

      if (data && data.token) {
        localStorage.setItem("fittrack_token", data.token);
        localStorage.setItem(
          "fittrack_user",
          JSON.stringify({
            id: data.userId || "usr-101",
            firstName: data.firstName || "Member",
            lastName: data.lastName || "User",
            email: data.email || form.email,
            role: data.role || "MEMBER",
          })
        );

        showToast(`Welcome back, ${data.firstName || "User"}!`, "success");
        handleRouteByRole(data.role);
      } else {
        setError("Invalid email or password");
        showToast("Invalid email or password", "error");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please check your credentials.");
      showToast(err.message || "Login failed. Please check backend server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSent(true);
      showToast(`Password reset instructions sent to ${forgotEmail}!`, "success");
    }, 1200);
  };

  return (
    <div className="root">
      <div className="auth-layout auth-layout-fixed">
        <div className="auth-side">
          <button className="auth-back-btn" onClick={() => navigate("/")}>
            <span className="auth-back-btn-icon">←</span> Back to home
          </button>
          <div className="auth-side-content">
            <h1 className="auth-side-title">Welcome back to FitTrack</h1>
            <p className="auth-side-desc">Your fitness journey continues here.</p>
            <ul className="auth-side-list">
              {LOGIN_BENEFITS.map((b) => (
                <li key={b} className="auth-side-list-item">
                  <span className="auth-side-dot" />{b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="auth-main">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Sign in to your account</h2>
            <p className="auth-form-subtitle">Enter your credentials to continue</p>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", color: "#991B1B" }}>
                ❌ {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    style={{ paddingRight: "42px" }}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => {
                    setForgotEmail(form.email);
                    setResetSent(false);
                    setShowForgotModal(true);
                  }}
                  style={{ background: "none", border: "none", color: "#4F46E5", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="auth-footer-text">
              Don't have an account?{" "}
              <button className="auth-footer-link" onClick={() => navigate("/register")}>
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", padding: "28px" }}>
            <button className="modal-close" onClick={() => setShowForgotModal(false)}>
              <X size={20} />
            </button>

            {!resetSent ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <KeyRound size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Reset Password</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>We'll send reset instructions to your email</p>
                  </div>
                </div>

                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label className="auth-label">Registered Email Address</label>
                    <div className="input-icon-wrapper">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        className="form-control with-icon"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={resetLoading}>
                    {resetLoading ? "Sending Reset Email..." : "Send Reset Instructions"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-3">
                <CheckCircle2 size={48} className="text-success mx-auto mb-2" />
                <h3>Email Sent!</h3>
                <p className="text-muted" style={{ fontSize: 13 }}>
                  Check <strong>{forgotEmail}</strong> for a password reset link. Follow the instructions to create a new password.
                </p>
                <button className="btn btn-primary btn-block mt-3" onClick={() => setShowForgotModal(false)}>
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
